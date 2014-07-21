/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world   = new World(this.size);
    this.inRound = false;
    this.deaths  = new Collection([], 'name');
    this.clients = this.room.clients;
    this.client  = new SocketGroup(this.clients);

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

    var avatar, i;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        avatar.update(step);

        if (avatar.alive) {
            if (!avatar.invincible && !this.world.testBody(avatar.body, true)) {
                avatar.die();
            } else {
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
    var result = BaseGame.prototype.removeAvatar.call(this, avatar);

    this.deaths.remove(avatar);
    this.checkRoundEnd();

    return result;
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
    var game = this,
        winner = this.avatars.match(function () { return this.score >= game.maxScore; });

    return winner ? winner : false;
};

/**
 * On die
 *
 * @param {Object} data
 */
Game.prototype.onDie = function(data)
{
    this.deaths.add(data.avatar);

    this.checkRoundEnd();
};

/**
 * Check if the round should end
 */
Game.prototype.checkRoundEnd = function()
{
    if (!this.inRound) {
        return;
    }

    var alivePlayers = this.avatars.filter(function () { return this.alive; });

    if (alivePlayers.count() <= 1) {
        this.inRound = false;
        this.setScores();
        setTimeout(this.endRound, this.warmdownTime);
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
 * Set scores
 */
Game.prototype.setScores = function()
{
    if (this.end) {
        var total = this.avatars.count();

        for (var i = this.deaths.items.length - 1; i >= 0; i--) {
            this.deaths.items[i].addScore(i+1);
        }

        if (this.deaths.count() < total) {
            var winner = this.avatars.match(function () { return this.alive; });

            winner.addScore(total);
            this.emit('round:winner', {game: this, winner: winner});
        }

        this.deaths.clear();
    }
};

/**
 * Check end of round
 */
Game.prototype.endRound = function()
{
    BaseGame.prototype.endRound.call(this);
    this.emit('round:end', {game: this});

    if (this.isWon()) {
        this.end();
    } else {
        this.newRound();
    }
};

/**
 * New round
 */
Game.prototype.newRound = function()
{
    if (!this.inRound) {
        var avatar, i;

        this.world.clear();
        this.bonusManager.stop();

        this.inRound = true;
        this.deaths.clear();

        for (i = this.avatars.items.length - 1; i >= 0; i--) {
            avatar = this.avatars.items[i];

            avatar.clear();
            avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
            avatar.setAngle(Math.random() * Math.PI * 2);
        }

        BaseGame.prototype.newRound.call(this);

        this.emit('round:new', {game: this});
    }
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.printingTimeout = setTimeout(avatar.togglePrinting, 3000);
    }

    this.world.activate();
    this.bonusManager.start();

    BaseGame.prototype.onStart.call(this);
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    BaseGame.prototype.end.call(this);

    this.bonusManager.stop();
    this.world.clear();
};
