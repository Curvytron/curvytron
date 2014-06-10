/**
 * Game
 */
function Game()
{
    BaseGame.call(this);

    this.loop = this.loop.bind(this);
}

Game.prototype = Object.create(BaseGame.prototype);