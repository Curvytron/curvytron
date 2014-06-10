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
 * Collection
 *
 * @param {Array} items
 * @param {String} key
 * @param {Boolean} index
 */
function Collection(items, key, index)
{
    this.ids   = [];
    this.items = [];
    this.key   = typeof(key) != 'undefined' && key ? key : 'id';
    this.index = typeof(index) != 'undefined' && index;

    if (this.index) {
        this.id = 1;
    }

    if (items) {
        for (var i = items.length - 1; i >= 0; i--) {
            this.add(items[i]);
        }
    }
}

/**
 * Count the size of the collection
 *
 * @return {Number}
 */
Collection.prototype.count = function()
{
    return this.ids.length;
};

/**
 * Is the collection empty?
 *
 * @return {Boolean}
 */
Collection.prototype.isEmpty = function()
{
    return this.ids.length === 0;
};

/**
 * Add an element
 *
 * @param {mixed} element
 * @param {Number} ttl
 *
 * @return {Boolean}
 */
Collection.prototype.add = function(element, ttl)
{
    this.setId(element);

    if (this.exists(element)) {
        return false;
    }

    this.ids.push(element[this.key]);

    var index = this.ids.indexOf(element[this.key]);

    this.items[index] = element;

    if (typeof(ttl) !== 'undefined' && ttl) {
        var collection = this;
        setTimeout(function () { collection.remove(element); }, ttl);
    }

    return true;
};

/**
 * Remove an element
 *
 * @param {mixed} element
 *
 * @return {Boolean}
 */
Collection.prototype.remove = function(element)
{
    var index = this.ids.indexOf(element[this.key]);

    if (index >= 0) {
        this.deleteIndex(index);
        return true;
    }

    return false;
};

/**
 * Remove an element by its id
 *
 * @param {mixed} id
 *
 * @return {Boolean}
 */
Collection.prototype.removeById = function(id)
{
    var index = this.ids.indexOf(id);

    if (index >= 0) {
        this.deleteIndex(index);
        return true;
    }

    return false;
};

/**
 * Set the id of an element
 *
 * @param {mixed} element
 */
Collection.prototype.setId = function(element)
{
    if (this.index && (typeof(element[this.key]) == 'undefined' || element[this.key] === null)) {
        element[this.key] = this.id;
        this.id++;
    }
};

/**
 * Get the index for the given element
 *
 * @param {mixed} element
 *
 * @return {Number}
 */
Collection.prototype.getElementIndex = function(element)
{
    return this.ids.indexOf(element[this.key]);
};

/**
 * Get the index fo the given id
 *
 * @param {Number} id
 *
 * @return {Number}
 */
Collection.prototype.getIdIndex = function(id)
{
    return this.ids.indexOf(id);
};

/**
 * Delete the element at the given index
 *
 * @param {Number} index
 */
Collection.prototype.deleteIndex = function(index)
{
    this.items.splice(index, 1);
    this.ids.splice(index, 1);
};

/**
 * Get an element by its id
 *
 * @param {Number} id
 *
 * @return {mixed}
 */
Collection.prototype.getById = function(id)
{
    var index = this.ids.indexOf(id);

    return index >= 0 ? this.items[index] : null;
};

/**
 * Get an element by its index
 *
 * @param {Number} index
 *
 * @return {mixed}
 */
Collection.prototype.getByIndex = function(index)
{
    return typeof(this.items[index]) != 'undefined' ? this.items[index] : null;
};

/**
 * Test if an element is in the collection
 *
 * @param {mixed} element
 *
 * @return {Boolean}
 */
Collection.prototype.exists = function(element)
{
    return this.getElementIndex(element) >= 0;
};

/**
 * Map
 *
 * @param {Function} callable
 *
 * @return {Collection}
 */
Collection.prototype.map = function(callable)
{
    var elements = [];

    for (var i = this.items.length - 1; i >= 0; i--) {
        elements.push(callable.call(this.items[i]));
    }

    return new Collection(elements, this.key, this.index);
};

/**
 * Filter
 *
 * @param {Function} callable
 *
 * @return {Collection}
 */
Collection.prototype.filter = function(callable)
{
    var elements = [];

    for (var i = this.items.length - 1; i >= 0; i--) {
        if (callable.call(this.items[i])) {
            elements.push(this.items[i]);
        }
    }

    return new Collection(elements, this.key, this.index);
};

/**
 * Match
 *
 * @param {Function} callable
 *
 * @return {Collection}
 */
Collection.prototype.match = function(callable)
{
    for (var i = this.items.length - 1; i >= 0; i--) {
        if (callable.call(this.items[i])) {
            return this.items[i];
        }
    }

    return null;
};

/**
 * Apply the given callback to all element
 *
 * @param {Function} callable
 */
Collection.prototype.walk = function(callable)
{
    for (var i = this.items.length - 1; i >= 0; i--) {
        callable.call(this.items[i]);
    }
};

/**
 * Get random item from the collection
 *
 * @return {mixed}
 */
Collection.prototype.getRandomItem = function()
{
    if (this.items.length === 0) {
        return null;
    }

    return this.items[Math.floor(Math.random() * this.items.length)];
};

/**
 * Get first item in collection
 *
 * @return {Mixed}
 */
Collection.prototype.getFirst = function()
{
    return this.items.length > 0 ? this.items[0] : null;
};

/**
 * Get last item in collection
 *
 * @return {Mixed}
 */
Collection.prototype.getLast = function()
{
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
};
/**
 * BaseGame
 */
function BaseGame()
{
    this.frame   = null;
    this.players = null;
}

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step)
{
    for (var i = this.players.ids.length - 1; i >= 0; i--) {
        this.players.items[i].update(step);
    }
};

/**
 * Add a player to the game
 *
 * @param {Player} player
 */
BaseGame.prototype.addPlayer = function(player)
{
    return this.players.add(player);
};

/**
 * Remove a player from the game
 *
 * @param {Player} player
 */
BaseGame.prototype.removePlayer = function(player)
{
    return this.players.remove(player);
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
/**
 * Base Lobby
 */
function BaseLobby(name)
{
    this.name    = name;
    this.players = new Collection([], 'name');
    this.game    = null;
}

/**
 * Add player
 *
 * @param {Player} player
 */
BaseLobby.prototype.addPlayer = function(player)
{
    return this.players.add(player);
};

/**
 * Remove player
 *
 * @param {Player} player
 */
BaseLobby.prototype.removePlayer = function(player)
{
    return this.players.remove(player);
};
/**
 * BasePlayer
 *
 * @param {String} name
 * @param {String} color
 */
function BasePlayer(name, color)
{
    EventEmitter.call(this);

    this.name  = name;
    this.color = color || 'red';
    this.trail = new Trail(this.color);
}

BasePlayer.prototype = Object.create(EventEmitter.prototype);

/**
 * Update
 */
BasePlayer.prototype.update = function()
{
    this.trail.update();
};
/**
 * BaseTrail
 */
function BaseTrail(color)
{
    this.color         = color;
    this.head          = [0, 0];
    this.lastPosition  = this.head;
    this.angle         = 0.5;
    this.velocities    = [];
    this.points        = [];

    this.updateVelocities();
}

BaseTrail.prototype.velocity  = 5;
BaseTrail.prototype.radius    = 10;
BaseTrail.prototype.precision = 10;

/**
 * Update
 */
BaseTrail.prototype.update = function()
{
    this.head[0] += this.velocities[0];
    this.head[1] += this.velocities[1];

    if (this.getDistance(this.lastPosition, this.head) > this.precision) {
        this.addPoint(this.head);
    }
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
BaseTrail.prototype.setAngle = function(angle)
{
    this.angle = angle;

    this.updateVelocities();
};

/**
 * Add angle
 *
 * @param {Float} angle
 */
BaseTrail.prototype.addAngle = function(angle)
{
    this.setAngle(this.angle + angle);
};

/**
 * Add point
 *
 * @param {Array} point
 */
BaseTrail.prototype.addPoint = function(point)
{
    this.lastPosition = point;

    this.points.push(point);
};

/**
 * Update velocities
 */
BaseTrail.prototype.updateVelocities = function()
{
    this.velocities = [
        Math.cos(this.angle) * this.velocity,
        Math.sin(this.angle) * this.velocity
    ];
};

/**
 * Get distance
 *
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Number}
 */
BaseTrail.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};
/**
 * Core
 *
 * @param {Object} config
 */
function Core(config)
{
    this.io = io();

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.socket.on('open', this.onSocketConnection);
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Core.prototype.onSocketConnection = function(data)
{
    console.log('Connected', data);

    this.attachEvents();
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Core.prototype.onSocketDisconnection = function(e)
{
    console.log('Disconnect', e);
};
/**
 * Game
 */
function Game()
{
    BaseGame.call(this);

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
    this.draw(step);
};
/**
 * Lobby
 */
function Lobby(name)
{
    BaseLobby.call(this, name);
}

Lobby.prototype = Object.create(BaseLobby.prototype);
/**
 * Player
 *
 * @param {String} name
 * @param {String} color
 */
function Player(name, color)
{
    BasePlayer.call(this, name, color);

    this.input = new PlayerInput();
}

Player.prototype = Object.create(BasePlayer.prototype);

/**
 * Update
 */
Player.prototype.update = function()
{
    if (this.input.key) {
        this.trail.addAngle(0.1 * (this.input.key == '37' ? -1 : 1));
    }

    BasePlayer.prototype.update.call(this);
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
    BaseTrail.call(this, color);

    this.path = paper.Path();

    this.path.strokeColor   = this.color;
    this.path.strokeWidth   = this.radius;
    this.path.strokeCap     = 'round';
    this.path.strokeJoin    = 'round';
    this.path.fullySelected = true;
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.addPoint = function(point)
{
    this.path.moveTo(point);
    this.path.lineTo(point);
    /*this.add(this.head.add(this.velocities));
     this.smooth();*/
};
var loaded = false;

function onload ()
{
    if (!loaded) {

        window.removeEventListener('load', onload);

        loaded = true;

        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        new Core({port: 8080});
    }
}

window.addEventListener('load', onload);