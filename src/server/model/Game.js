/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);
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

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].update(step);
    }
};