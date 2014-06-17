/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    this.canvas = document.getElementById('game');
    this.size   = this.getSize(room.players.count());

    paper.setup(this.canvas);
    this.onResize();

    BaseGame.call(this, room);

    window.addEventListener('error', this.stop);
    window.addEventListener('resize', this.onResize);
}

Game.prototype = Object.create(BaseGame.prototype);

/**
 * On start
 */
Game.prototype.onStart = function()
{
    BaseGame.prototype.onStart.call(this);

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].setStarted(true);
    }
};

/**
 * On start
 */
Game.prototype.onStop = function()
{
    BaseGame.prototype.onStop.call(this);

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].setStarted(false);
    }
};


/**
 * Stop loop
 */
Game.prototype.stop = function()
{
    if (this.frame) {
        window.cancelAnimationFrame(this.frame);
        this.onStop();
    }
};

/**
 * Get new frame
 */
Game.prototype.newFrame = function()
{
    this.frame = window.requestAnimationFrame(this.loop);
};

/**
 * On frame
 *
 * @param {Number} step
 */
Game.prototype.onFrame = function(step)
{
    BaseGame.prototype.onFrame.call(this, step);

    paper.view.draw();
};

/**
 * New round
 */
Game.prototype.newRound = function()
{
    BaseGame.prototype.newRound.call(this);

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].clear();
    }

    paper.view.update();
    paper.view.draw();
};
/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    BaseGame.prototype.end.call(this);

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].clear();
    }
};

/**
 * On resize
 */
Game.prototype.onResize = function()
{
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

    var width = Math.min(x - 300 - 8, y);

    paper.view.viewSize.width = width;
    paper.view.viewSize.height = width;
    paper.sceneScale = width / this.size;
};
