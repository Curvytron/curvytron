/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world  = new World(this.size);

    this.addPoint = this.addPoint.bind(this);
    this.onDie    = this.onDie.bind(this);

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].on('point', this.addPoint);
        this.avatars.items[i].on('die', this.onDie);
    }
}

Game.prototype = Object.create(BaseGame.prototype);

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
 * Add point
 *
 * @param {Object} data
 */
Game.prototype.addPoint = function(data)
{
    var world = this.world,
        circle = [data.point[0], data.point[1], data.avatar.radius];

    setTimeout(function () { world.addCircle(circle); }, 100);
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
    var alivePlayers = this.avatars.filter(function () { return this.alive; }),
        size = this.avatars.count();

    data.avatar.addScore(size - alivePlayers.count());

    if (alivePlayers.count() === 1) {
        alivePlayers.items[0].addScore(size);
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
