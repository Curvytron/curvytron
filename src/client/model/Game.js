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

    paper.view.onFrame = this.onFrame;
}

Game.prototype = Object.create(BaseGame.prototype);

/**
 * On start
 */
Game.prototype.onStart = function()
{
    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].setStarted(true);
    }

    BaseGame.prototype.onStart.call(this);
};

/**
 * On start
 */
Game.prototype.onStop = function()
{
    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].setStarted(false);
    }

    BaseGame.prototype.onStop.call(this);
};

/**
 * Start loop
 */
Game.prototype.start = function()
{
    this.started = true;

    if (!this.frame) {
        this.frame = true;
        this.onStart();
    }
};

/**
 * Stop loop
 */
Game.prototype.stop = function()
{
    if (this.frame) {
        this.frame = null;
        this.onStop();
    }
};

/**
 * On frame
 *
 * @param {Event} e
 */
Game.prototype.onFrame = function(e)
{
    BaseGame.prototype.onFrame.call(this, e.delta * 1000);
};

/**
 * Get new frame
 */
Game.prototype.newFrame = function()
{
    this.frame = true;
};

/**
 * New round
 */
Game.prototype.newRound = function()
{
    BaseGame.prototype.newRound.call(this);

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].clear();
    }
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
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    avatar.path.remove();

    return BaseGame.prototype.removeAvatar.call(this, avatar);
};

/**
 * On resize
 */
Game.prototype.onResize = function()
{
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

    var width = Math.min(x - 300 - 8, y - 8);

    paper.view.viewSize.width  = width;
    paper.view.viewSize.height = width;

    paper.sceneScale = width / this.size;
};
