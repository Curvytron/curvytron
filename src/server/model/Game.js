/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.loop = this.loop.bind(this);
}

Game.prototype = Object.create(BaseGame.prototype);