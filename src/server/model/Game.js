/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world  = new World(this.size);
    this.end    = false;
    this.deaths = [];

    this.addPoint = this.addPoint.bind(this);
    this.onDie    = this.onDie.bind(this);

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].on('point', this.addPoint);
        this.avatars.items[i].on('die', this.onDie);
        this.avatars.items[i].setMask(i+1);
    }
}

Game.prototype = Object.create(BaseGame.prototype);

Game.prototype.trailLatency = 150;

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    BaseGame.prototype.update.call(this, step);

    var avatar;

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        if (avatar.alive && !this.world.testCircle(avatar.update(step))) {
            avatar.die();
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
    var world = this.world,
        circle = [data.point[0], data.point[1], data.avatar.radius, data.avatar.mask];

    setTimeout(function () { circle[3] = 0; }, this.trailLatency);

    world.addCircle(circle);
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
 * Add point
 *
 * @param {Object} data
 */
Game.prototype.onDie = function(data)
{
    this.deaths.push(data.avatar);

    this.checkRoundEnd();
};

/**
 * Check if the round should end
 */
Game.prototype.checkRoundEnd = function()
{
    if (this.end) {
        return;
    }

    var alivePlayers = this.avatars.filter(function () { return this.alive; });

    if (alivePlayers.count() <= 1) {
        this.end = true;
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
    return this.avatars.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Set scores
 */
Game.prototype.setScores = function()
{
    if (this.end) {
        var deaths = this.deaths.length,
            total = this.avatars.count();

        for (var i = deaths - 1; i >= 0; i--) {
            this.deaths[i].addScore(i + 1);
        }

        if (deaths < total) {
            var victor = this.avatars.match(function () { return this.alive; });

            victor.addScore(total);
        }

        this.deaths = [];
    }
};

/**
 * Check end of round
 */
Game.prototype.endRound = function()
{
    BaseGame.prototype.endRound.call(this);

    this.emit('round:end');

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
    var avatar;

    this.emit('round:new');

    this.world.clear();

    this.end    = false;
    this.deaths = [];

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.clear();
        avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
    }

    BaseGame.prototype.newRound.call(this);
};

/**
 * Start
 */
Game.prototype.start = function()
{
    if (!this.frame) {
        for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
            setTimeout(this.avatars.items[i].togglePrinting, 3000);
        }
    }

    BaseGame.prototype.start.call(this);
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    this.world.clear();

    this.emit('end');

    BaseGame.prototype.end.call(this);
};
