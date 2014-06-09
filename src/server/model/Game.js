/**
 * Game
 */
function Game()
{
    BaseGame.prototype.call(this);

    this.loop = this.loop.bind(this);
}

Game.prototype = Object.create(BaseGame.prototype);