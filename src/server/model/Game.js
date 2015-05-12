/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world       = new World(this.size);
    this.deaths      = new Collection([], 'id');
    this.controller  = new GameController(this);
    this.bonusStack  = new GameBonusStack(this);
    this.roundWinner = null;
    this.gameWinner  = null;

    this.addPoint = this.addPoint.bind(this);

    var avatar, i;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.clear();
        avatar.on('point', this.addPoint);
    }
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    var score = this.deaths.count(),
        avatar, border, i, borderX, borderY, borderAxis, position, killer;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        dead   = false;

        if (avatar.alive) {
            avatar.update(step);

            border = this.world.getBoundIntersect(avatar.body, this.borderless ? 0 : avatar.radius);

            if (border) {
                borderX    = border[0];
                borderY    = border[1];
                borderAxis = border[2];

                if (this.borderless) {
                    if (this.testBorder(avatar.x, avatar.y, avatar.velocityX, avatar.velocityY, borderX, borderY, borderAxis)) {
                        position = this.world.getOposite(borderX, borderY);
                        avatar.setPosition(position[0], position[1]);
                    }
                } else {
                    this.kill(avatar, null, score);
                }
            } else if (!avatar.invincible) {
                killer = this.world.getBody(avatar.body);

                if (killer) {
                    this.kill(avatar, killer, score);
                }
            }

            if (avatar.alive) {
                avatar.printManager.test();
                this.bonusManager.testCatch(avatar);
            }
        }
    }

    if (!this.deaths.isEmpty()) {
        this.checkRoundEnd();
    }
};

/**
 * Kill an avatar
 *
 * @param {Avatar} avatar
 * @param {Body|null} killer
 * @param {Number} score
 */
Game.prototype.kill = function(avatar, killer, score) {
    avatar.die(killer);
    avatar.addScore(score);
    this.deaths.add(avatar);
};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    BaseGame.prototype.removeAvatar.call(this, avatar);
    this.emit('player:leave', {player: avatar.player});
    this.checkRoundEnd();
};

/**
 * Add point
 *
 * @param {Object} data
 */
Game.prototype.addPoint = function(data)
{
    if (this.started && this.world.active) {
        this.world.addBody(new AvatarBody(data.x, data.y, data.avatar));
    }
};

/**
 * Is done
 *
 * @return {Boolean}
 */
Game.prototype.isWon = function()
{
    var present = this.getPresentAvatars().count();

    if (present <= 0) { return true; }
    if (this.avatars.count() > 1 && present <= 1) { return true; }

    var maxScore = this.maxScore,
        players = this.avatars.filter(function () { return this.present && this.score >= maxScore; });

    if (players.count() === 0) {
        return null;
    }

    if (players.count() === 1) {
        return players.getFirst();
    }

    this.sortAvatars(players);

    return players.items[0].score === players.items[1].score ? null : players.getFirst();
};

/**
 * Check if the round should end
 */
Game.prototype.checkRoundEnd = function()
{
    if (this.inRound && this.getAliveAvatars().count() <= 1) {
        this.endRound();
    }
};

/**
 * Resolve scores
 */
Game.prototype.resolveScores = function()
{
    var winner;

    if (this.avatars.count() === 1) {
        winner = this.avatars.getFirst();
    } else {
        winner = this.avatars.match(function () { return this.alive; });
    }

    if (winner) {
        winner.addScore(Math.max(this.avatars.count() - 1, 1));
        this.roundWinner = winner;
    }

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].resolveScore();
    }
};

/**
 * Test border
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} vX
 * @param {Number} vY
 * @param {Number} borderX
 * @param {Number} borderY
 * @param {Number} axis
 *
 * @return {Boolean}
 */
Game.prototype.testBorder = function(x, y, vX, vY, borderX, borderY, axis)
{
    return axis ? this.testBorderAxis(y, vY, borderY) : this.testBorderAxis(x, vX, borderX);
};

/**
 * Test border axis
 *
 * @param {Number} position
 * @param {Number} velocity
 * @param {Number} border
 *
 * @return {Boolean}
 */
Game.prototype.testBorderAxis = function(position, velocity, border)
{
    return (position > border) === (velocity < 0);
};

/**
 * Clear trails
 */
Game.prototype.clearTrails = function()
{
    this.world.clear();
    this.world.activate();
    this.emit('clear', {game: this});
};

/**
 * Update size
 */
Game.prototype.setSize = function()
{
    BaseGame.prototype.setSize.call(this);

    this.world.clear();
    this.world = new World(this.size);

    this.bonusManager.setSize();
};

/**
 * Check end of round
 */
Game.prototype.onRoundEnd = function()
{
    this.resolveScores();
    this.emit('round:end', {game: this, winner: this.roundWinner});
};

/**
 * New round
 */
Game.prototype.onRoundNew = function()
{
    this.emit('round:new', {game: this});
    BaseGame.prototype.onRoundNew.call(this);

    var avatar, position, i;

    this.roundWinner = null;
    this.world.clear();
    this.deaths.clear();
    this.bonusStack.clear();

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.present) {
            position = this.world.getRandomPosition(avatar.radius, this.spawnMargin);
            avatar.setPosition(position[0], position[1]);
            avatar.setAngle(this.world.getRandomDirection(avatar.x, avatar.y, this.spawnAngleMargin));
        } else {
            this.deaths.add(avatar);
        }
    }
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    this.emit('game:start', {game: this});

    for (var avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        setTimeout(avatar.printManager.start, 3000);
    }

    this.world.activate();

    BaseGame.prototype.onStart.call(this);
};

/**
 * On stop
 */
Game.prototype.onStop = function()
{
    this.emit('game:stop', {game: this});

    BaseGame.prototype.onStop.call(this);

    var won = this.isWon();

    if (won) {
        if (won instanceof Avatar) {
            this.gameWinner = won;
        }
        this.end();
    } else {
        this.newRound();
    }
};

/**
 * Set borderless
 *
 * @param {Boolean} borderless
 */
Game.prototype.setBorderless = function(borderless)
{
    if (this.borderless !== borderless) {
        BaseGame.prototype.setBorderless.call(this, borderless);
        this.emit('borderless', this.borderless);
    }
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    if (BaseGame.prototype.end.call(this)) {
        this.avatars.clear();
        this.world.clear();

        delete this.world;
        delete this.avatars;
        delete this.deaths;
        delete this.bonusManager;
        delete this.controller;
    }
};
