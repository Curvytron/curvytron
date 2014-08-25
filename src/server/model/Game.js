/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world   = new World(this.size);
    this.deaths  = new Collection([], 'id');
    this.clients = this.room.clients;
    this.client  = this.room.client;

    this.addPoint = this.addPoint.bind(this);
    this.onDie    = this.onDie.bind(this);

    var avatar, i;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.game = this;
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

            border = this.world.getBoundIntersect(avatar.body, avatar.borderless ? 0 : avatar.radius);

            if (border) {
                if (avatar.borderless) {
                    if (this.testBorder(avatar.head, avatar.velocities, border)) {
                        avatar.setPosition(this.world.getOposite(border));
                    }
                } else {
                    avatar.die();
                }
            } else if (!avatar.invincible && !this.world.testBody(avatar.body)) {
                avatar.die();
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
    this.checkRoundEnd();
};

/**
 * Add point
 *
 * @param {Object} data
 */
Game.prototype.addPoint = function(data)
{
    if (this.world.active) {
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
    var presents = this.getPresentAvatars(),
        maxScore = this.maxScore;

    if (presents.count() === 1) {
        return presents.getFirst();
    }

    presents.sort(function (a, b) { return a.score > b.score ? 1 : (a.score < b.score ? -1 : 0); });

    return presents.match(function () { return this.score >= maxScore; });
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
 * Is ready
 *
 * @return {Boolean}
 */
Game.prototype.isReady = function()
{
    return this.avatars.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Resolve scores
 */
Game.prototype.resolveScores = function()
{
    if (this.end) {
        var winner = this.avatars.match(function () { return this.alive; });

        if (winner) {
            winner.addScore(this.avatars.count() - 1);
            this.emit('round:winner', {game: this, winner: winner});
        }

        for (var i = this.avatars.items.length - 1; i >= 0; i--) {
            this.avatars.items[i].resolveScore();
        }
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

    this.world.clear();
    this.deaths.clear();

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.present) {
            avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
            avatar.setAngle(Math.random() * Math.PI * 2);
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

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
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

    if (this.isWon()) {
        this.end();
    } else {
        this.newRound();
    }
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    BaseGame.prototype.end.call(this);

    this.world.clear();
};
