/*!
 * curvytron 0.0.1
 * https://github.com/Gameo/curvytron
 * MIT
 */

function EventEmitter(){this._eventElement=document.createElement("div")}EventEmitter.prototype.emit=function(t,e){this._eventElement.dispatchEvent(new CustomEvent(t,{detail:e}))},EventEmitter.prototype.addEventListener=function(t,e){this._eventElement.addEventListener(t,e,!1)},EventEmitter.prototype.removeEventListener=function(t,e){this._eventElement.removeEventListener(t,e,!1)},EventEmitter.prototype.on=EventEmitter.prototype.addEventListener,EventEmitter.prototype.off=EventEmitter.prototype.removeEventListener;
/*!
 * option-resolver.js 0.0.2
 * https://github.com/Tom32i/option-resolver.js
 * Copyright 2014 Thomas JARRAND
 */

function OptionResolver(t){this.allowExtra="undefined"!=typeof t&&t,this.defaults={},this.types={},this.optional=[],this.required=[]}OptionResolver.prototype.setDefaults=function(t){for(var e in t)t.hasOwnProperty(e)&&(this.defaults[e]=t[e]);return this},OptionResolver.prototype.setTypes=function(t){for(var e in t)t.hasOwnProperty(e)&&(this.types[e]=t[e]);return this},OptionResolver.prototype.setOptional=function(t){return this.allowExtra?void 0:(this.addToArray(this.optionals,t),this)},OptionResolver.prototype.setRequired=function(t){return this.addToArray(this.required,t),this},OptionResolver.prototype.resolve=function(t){var e={};for(var o in this.defaults)this.defaults.hasOwnProperty(o)&&(e[o]=this.getValue(t,o));for(var i=this.required.length-1;i>=0;i--)if(o=this.required[i],"undefined"==typeof e[o])throw'Option "'+o+'" is required.';return e},OptionResolver.prototype.getValue=function(t,e){var o=null;if(!this.optionExists(e))throw'Unkown option "'+e+'".';return"undefined"!=typeof t[e]?o=t[e]:"undefined"!=typeof this.defaults[e]&&(o=this.defaults[e]),this.checkType(e,o),o},OptionResolver.prototype.checkType=function(t,e){var o="undefined"!=typeof this.types[t]?this.types[t]:!1,i=typeof e;if(o&&i!==o&&("string"===o&&(e=String(e)),"boolean"===o&&(e=Boolean(e)),"number"===o&&(e=Number(e)),i=typeof e,o!==i))throw'Wrong type for option "'+t+'". Expected '+this.types[t]+" but got "+typeof e},OptionResolver.prototype.optionExists=function(t){return this.allowExtra?!0:"undefined"!=typeof this.defaults[t]||this.optional.indexOf(t)>=0||this.required.indexOf(t)>=0},OptionResolver.prototype.addToArray=function(t,e){for(var o,i=e.length-1;i>=0;i--)o=e[i],t.indexOf(o)>=0&&t.push(o)};
/**
 * BaseGame
 */
function BaseGame()
{
    this.frame   = null;
    this.players = [];

    this.addPlayer(new Player('red'));

    this.start();

    setTimeout(this.stop.bind(this), 5000);
}

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step)
{
    for (var i = this.players.length - 1; i >= 0; i--) {
        this.players[i].update(step);
    }
};

/**
 * Add a player to the game
 *
 * @param {Player} player
 */
BaseGame.prototype.addPlayer = function(player)
{
    this.players.push(player);
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    if (!this.frame) {
        this.rendered = new Date().getTime();
        this.loop();
    }
};

/**
 * Stop loop
 */
BaseGame.prototype.stop = function()
{
    if (this.frame) {
        clearTimeout(this.frame);
        this.frame = null;
    }
};

/**
 * Animation loop
 */
BaseGame.prototype.loop = function()
{
    this.newFrame();

    var now = new Date().getTime(),
        step = now - this.rendered;

    this.rendered = now;

    this.onFrame();
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop.bind(this), this.framerate * 1000);
};

/**
 * On frame
 *
 * @param {Number} step
 */
BaseGame.prototype.onFrame = function(step)
{
    this.update();
};
var loaded = false;

function onload ()
{
    if (!loaded) {

        window.removeEventListener('load', onload);

        loaded = true;

        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        new Game();
    }
}

window.addEventListener('load', onload);
console.log(BaseGame);

/**
 * Game
 */
function Game()
{
    BaseGame.prototype.call(this);

    this.canvas = document.createElement('canvas');

    this.loop = this.loop.bind(this);

    this.canvas.setAttribute('resize', true);
    document.body.appendChild(this.canvas);
    paper.setup(this.canvas);
}

Game.prototype = Object.create(BaseGame.prototype);

/**
 * Draw
 */
Game.prototype.draw = function()
{
    paper.view.draw();
};

/**
 * Stop loop
 */
Game.prototype.stop = function()
{
    if (this.frame) {
        window.cancelAnimationFrame(this.frame);
        this.frame = null;
    }
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = window.requestAnimationFrame(this.loop);
};

/**
 * On frame
 *
 * @param {Number} step
 */
BaseGame.prototype.onFrame = function(step)
{
    BaseGame.prototype.onFrame.call(step);
    this.draw(step);
};
/**
 * Player
 *
 * @param {String} color
 */
function Player(color)
{
    EventEmitter.call(this);

    this.color = color || 'red';
    this.input = new PlayerInput();
    this.trail = new Trail(this.color);
}

Player.prototype = Object.create(EventEmitter.prototype);

/**
 * Update
 */
Player.prototype.update = function()
{
    if (this.input.key) {
        this.trail.addAngle(0.1 * (this.input.key == '37' ? -1 : 1));
    }

    this.trail.update();
};
function PlayerInput()
{
    this.key = false;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp   = this.onKeyUp.bind(this);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
}

/**
 * On Key Down
 *
 * @param {Event} e
 */
PlayerInput.prototype.onKeyDown = function(e)
{
    this.key = e.keyCode;
};

/**
 * On Key Down
 *
 * @param {Event} e
 */
PlayerInput.prototype.onKeyUp = function(e)
{
    this.key = false;
};
/**
 * Trail
 * @constructor
 */
function Trail(color)
{
    paper.Path.call(this);
    console.log(this);

    this.color         = color;

    this.head          = new paper.Point(0, 0);
    this.lastPosition  = this.head.clone();

    this.angle         = 0.5;
    this.velocities    = [];

    this.strokeColor   = this.color;
    this.strokeWidth   = this.radius;
    this.strokeCap     = 'round';
    this.strokeJoin    = 'round';
    this.fullySelected = true;

    this.updateVelocities();
}

Trail.prototype = Object.create(paper.Path.prototype);

Trail.prototype.velocity      = 5;
Trail.prototype.radius        = 10;
Trail.prototype.precision     = 10;

/**
 * Update
 */
Trail.prototype.update = function()
{
    this.head = this.head.add(this.velocities);

    if (this.lastPosition.getDistance(this.head) > this.precision) {
        this.lastPosition = this.head.clone();
        this.moveTo(this.head);
        /*this.add(this.head.add(this.velocities));
         this.smooth();*/
        this.lineTo(this.head);
    }
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
Trail.prototype.setAngle = function(angle)
{
    this.angle = angle;

    this.updateVelocities();
};

/**
 * Add angle
 *
 * @param {Float} angle
 */
Trail.prototype.addAngle = function(angle)
{
    this.setAngle(this.angle + angle);
};

/**
 * Update velocities
 */
Trail.prototype.updateVelocities = function()
{
    this.velocities = [
        Math.cos(this.angle) * this.velocity,
        Math.sin(this.angle) * this.velocity
    ];
};