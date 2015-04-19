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
    this.onDie    = this.onDie.bind(this);

    var avatar, i;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.clear();
        avatar.on('point', this.addPoint);
        avatar.on('die', this.onDie);
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
    BaseGame.prototype.update.call(this, step);

    var avatar, border, i;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        if (avatar.alive) {
            avatar.update(step);

            border = this.world.getBoundIntersect(avatar.body, this.borderless ? 0 : avatar.radius);

            if (border) {
                if (this.borderless) {
                    if (this.testBorder(avatar.head, avatar.velocities, border)) {
                        avatar.setPosition(this.world.getOposite(border));
                    }
                } else {
                    avatar.die(null);
                }
            } else if (!avatar.invincible) {
                var killer = this.world.getBody(avatar.body);

                if (null !== killer) {
                    avatar.die(killer);
                }
            }

            if (avatar.alive) {
                avatar.printManager.test();
                this.bonusManager.testCatch(avatar);
            }
        }
    }
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
        this.world.addBody(new AvatarBody(data.point, data.avatar));
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
 * On die
 *
 * @param {Object} data
 */
Game.prototype.onDie = function(data)
{
    this.deaths.add(data.avatar);
    data.avatar.addScore(this.deaths.count() - 1);
    this.checkRoundEnd();
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
        this.roundWinner = winner;
        winner.addScore(Math.max(this.avatars.count() - 1, 1));
        this.emit('round:winner', {game: this, winner: winner});
    }

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].resolveScore();
    }
};

/**
 * Test border
 *
 * @param {Array} position
 * @param {Array} velocities
 * @param {Array} border
 *
 * @return {Boolean}
 */
Game.prototype.testBorder = function(position, velocities, border)
{
    var axis = border[2];

    return (position[axis] > border[axis]) === (velocities[axis] < 0);
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
    this.emit('round:end', {game: this});
    BaseGame.prototype.onRoundEnd.call(this);
    this.resolveScores();
};

/**
 * New round
 */
Game.prototype.onRoundNew = function()
{
    this.emit('round:new', {game: this});
    BaseGame.prototype.onRoundNew.call(this);

    var avatar, i;

    this.roundWinner = null;
    this.world.clear();
    this.deaths.clear();
    this.bonusStack.clear();

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.present) {
            avatar.setPosition(this.world.getRandomPosition(avatar.radius, this.spawnMargin));
            avatar.setAngle(this.world.getRandomDirection(avatar.head, this.spawnAngleMargin));
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
    BaseGame.prototype.setBorderless.call(this, borderless);
    this.emit('borderless', this.borderless);
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    BaseGame.prototype.end.call(this);

    this.world.clear();

    delete this.world;
    delete this.avatars;
    delete this.deaths;
    delete this.bonusManager;
    delete this.controller;
};
