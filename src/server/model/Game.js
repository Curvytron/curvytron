/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world = new World(this.avatars.count() * 100);
}

Game.prototype = Object.create(BaseGame.prototype);

/**
 * Start
 */
Game.prototype.start = function()
{
    console.log("startgame?");

    var avatar;

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.setPosition(this.world.getRandomPosition(avatar.radius));
        console.log('init', avatar.head);
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

        if (!this.world.test(avatar.update(step))) {
            avatar.die();
        }
    }
};