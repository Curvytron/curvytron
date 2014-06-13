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
}

Game.prototype = Object.create(BaseGame.prototype);

/**
 * Start
 */
Game.prototype.start = function()
{
    var avatar;

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.on('point', this.addPoint);
        avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
        avatar.addPoint(avatar.head.slice(0));
    }

    BaseGame.prototype.start.call(this);
};

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

    setTimeout(function () { world.addCircle(circle); }, 200);
};