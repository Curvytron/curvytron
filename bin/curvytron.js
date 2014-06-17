var EventEmitter = require('events').EventEmitter,
    http = require('http'),
    express = require('express'),
    io = require('socket.io');
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
 * FPS Logger
 */
function FPSLogger(element)
{
    this.fps     = 0;
    this.element = typeof(element) != 'undefined' ? element : null;

    this.clear = this.clear.bind(this);

    setInterval(this.clear, 1000);
}

/**
 * Update
 *
 * @param {Number} step
 */
FPSLogger.prototype.update = function(step)
{
    var fps = step > 0 ? 1000/step : 60;

    this.fps = this.fps ? (this.fps + fps)/2 : fps;
};

/**
 * Clear
 */
FPSLogger.prototype.clear = function()
{
    this.draw();

    this.fps = 0;
};

/**
 * Set element
 *
 * @param {DOMElement} element
 */
FPSLogger.prototype.setElement = function(element)
{
    this.element = element;
};

/**
 * Draw FPS
 */
FPSLogger.prototype.draw = function()
{
    if (this.element) {
        this.element.innerHTML = this.fps;
    } else {
        console.log(this.fps);
    }
};
/**
 * Base Avatar
 *
 * @param {Player} player
 */
function BaseAvatar(player, position)
{
    EventEmitter.call(this);

    this.name            = player.name;
    this.color           = player.color;
    this.player          = player;
    this.radius          = this.defaultRadius;
    this.head            = [this.radius, this.radius];
    this.trail           = new Trail(this.color, this.radius, this.head.slice(0));
    this.angle           = 0;
    this.velocities      = [0,0];
    this.angularVelocity = 0;
    this.alive           = true;
    this.printing        = false;
    this.score           = 0;
    this.printingTimeout = null;
    this.ready           = false;
    this.mask            = 0;

    this.togglePrinting = this.togglePrinting.bind(this);

    this.updateVelocities();
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);

BaseAvatar.prototype.precision           = 1;
BaseAvatar.prototype.velocity            = 18/1000;
BaseAvatar.prototype.angularVelocityBase = 2.8/1000;
BaseAvatar.prototype.noPrintingTime      = 200;
BaseAvatar.prototype.printingTime        = 3000;
BaseAvatar.prototype.defaultRadius       = 0.6;

/**
 * Set Point
 *
 * @param {Array} point
 */
BaseAvatar.prototype.setPosition = function(point)
{
    this.head[0] = point[0];
    this.head[1] = point[1];
};

/**
 * Add Point
 *
 * @param {Array} point
 */
BaseAvatar.prototype.addPoint = function(point)
{
    this.trail.addPoint(point);
};

/**
 * Set angular velocity
 *
 * @param {Number} factor
 */
BaseAvatar.prototype.setAngularVelocity = function(factor)
{
    if (!this.alive) { return; }

    this.angularVelocity = factor * this.angularVelocityBase;
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
BaseAvatar.prototype.setAngle = function(angle)
{
    if (!this.alive) { return; }

    this.angle = angle;

    this.updateVelocities();
};

/**
 * Update
 *
 * @param {Number} step
 */
BaseAvatar.prototype.update = function(step)
{
    return [this.head[0], this.head[1], this.radius, this.mask];
};

/**
 * Add angle
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updateAngle = function(step)
{
    this.setAngle(this.angle + this.angularVelocity * step);
};

/**
 * Update position
 *
 * @param {Number} step
 *
 * @return {[type]}
 */
BaseAvatar.prototype.updatePosition = function(step)
{
    this.setPosition([
        this.head[0] + this.velocities[0] * step,
        this.head[1] + this.velocities[1] * step
    ]);
};

/**
 * Update velocities
 */
BaseAvatar.prototype.updateVelocities = function()
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
BaseAvatar.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};

/**
 * Die
 */
BaseAvatar.prototype.die = function()
{
    this.alive = false;
    this.addPoint(this.head.slice(0));
};

/**
 * Start printing
 */
BaseAvatar.prototype.togglePrinting = function(e)
{
    this.printing = !this.printing;

    clearTimeout(this.printingTimeout);

    this.printingTimeout = setTimeout(this.togglePrinting, this.getRandomPrintingTime());

    if (!this.printing) {
        this.trail.clear();
    }
};

/**
 * Stop printing
 */
BaseAvatar.prototype.stopPrinting = function()
{
    clearTimeout(this.printingTimeout);

    this.printing = false;

    this.trail.clear();
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
BaseAvatar.prototype.getRandomPrintingTime = function()
{
    if (this.printing) {
        return this.printingTime * (0.2 + Math.random() * 0.8);
    } else {
        return this.noPrintingTime * (0.8 + Math.random() * 0.5);
    }
};

/**
 * This score
 *
 * @param {Number} score
 */
BaseAvatar.prototype.addScore = function(score)
{
    this.setScore(this.score + score);
};

/**
 * This score
 *
 * @param {Number} score
 */
BaseAvatar.prototype.setScore = function(score)
{
    this.score = score;
};

/**
 * Set mask
 *
 * @param {Number} mask
 */
BaseAvatar.prototype.setMask = function(mask)
{
    this.mask = mask;
};

/**
 * Clear
 */
BaseAvatar.prototype.clear = function()
{
    this.stopPrinting();

    this.head            = [this.radius, this.radius];
    this.angle           = Math.random() * Math.PI;
    this.velocities      = [0,0];
    this.angularVelocity = 0;
    this.alive           = true;
    this.printing        = false;

    this.updateVelocities();
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseAvatar.prototype.serialize = function()
{
    return {
        name: this.name,
        color: this.color,
        score: this.score
    };
};
/**
 * BaseGame
 *
 * @param {Room} room
 */
function BaseGame(room)
{
    EventEmitter.call(this);

    this.room     = room;
    this.name     = this.room.name;
    this.channel  = 'game:' + this.name;
    this.frame    = null;
    this.avatars  = this.room.players.map(function () { return new Avatar(this); });
    this.size     = this.getSize(this.avatars.count());
    this.rendered = null;
    this.maxScore = this.size * 10;
    this.fps      = new FPSLogger();

    this.start    = this.start.bind(this);
    this.stop     = this.stop.bind(this);
    this.loop     = this.loop.bind(this);
    this.newRound = this.newRound.bind(this);
    this.endRound = this.endRound.bind(this);
    this.end      = this.end.bind(this);
}

BaseGame.prototype = Object.create(EventEmitter.prototype);

BaseGame.prototype.framerate     = 1/60;
BaseGame.prototype.perPlayerSize = 100;
BaseGame.prototype.warmupTime    = 5000;
BaseGame.prototype.warmdownTime  = 3000;

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step) {};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
BaseGame.prototype.removeAvatar = function(avatar)
{
    avatar.clear();

    return this.avatars.remove(avatar);
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    if (!this.frame) {
        console.log("Game started!");
        this.onStart();
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
        this.onStop();
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

    this.onFrame(step);
};

/**
 * On start
 */
BaseGame.prototype.onStart = function() {};

/**
 * Onn stop
 */
BaseGame.prototype.onStop = function()
{
    this.frame    = null;
    this.rendered = null;
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
    this.update(step);
    this.fps.update();
};

/**
 * Get size by players
 *
 * @param {Number} players
 *
 * @return {Number}
 */
BaseGame.prototype.getSize = function(players)
{
    /**
     * Should be:
     * 2  -> 105 -> 11000
     * 3  -> 110 -> 12000
     * 4  -> 114 -> 13000
     * 5  -> 118 -> 14000
     */
    var baseSquareSize = this.perPlayerSize * this.perPlayerSize;

    return Math.sqrt(baseSquareSize + ((players - 1) * baseSquareSize / 5.0));
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseGame.prototype.serialize = function()
{
    return {
        name: this.name,
        players: this.avatars.map(function () { return this.serialize(); }).items
    };
};

/**
 * Is started
 *
 * @return {Boolean}
 */
BaseGame.prototype.isStarted = function()
{
    return this.rendered !== null;
};

/**
 * New round
 */
BaseGame.prototype.newRound = function()
{
    setTimeout(this.start, this.warmupTime);
};


/**
 * Check end of round
 */
BaseGame.prototype.endRound = function()
{
    this.stop();
};
/**
 * FIN DU GAME
 */
BaseGame.prototype.end = function()
{
    this.stop();
};

/**
 * BasePlayer
 *
 * @param {String} name
 * @param {String} color
 */
function BasePlayer(name, color, mail)
{
    this.name   = name;
    this.color  = typeof(color) !== 'undefined' ? color : this.getRandomColor();
    this.mail   = mail;
    this.ready  = false;
}

/**
 * Set name
 *
 * @param {String} name
 */
BasePlayer.prototype.setName = function(name)
{
    this.name = name;
};

/**
 * Set name
 *
 * @param {String} name
 */
BasePlayer.prototype.setColor = function(color)
{
    this.color = color;
};

/**
 * Toggle Ready
 *
 * @param {Boolean} toggle
 */
BasePlayer.prototype.toggleReady = function(toggle)
{
    this.ready = typeof(toggle) !== 'undefined' ? (toggle ? true : false) : !this.ready;
};

/**
 * Serialize
 *
 * @return {Object}
 */
BasePlayer.prototype.serialize = function()
{
    return {
        name: this.name,
        color: this.color,
        mail: this.mail,
        ready: this.ready
    };
};

/**
 * Get random Color
 *
 * @return {String}
 */
BasePlayer.prototype.getRandomColor = function()
{
    return '#' + Math.floor(Math.random()*16777215).toString(16);
};
/**
 * Base Room
 */
function BaseRoom(name)
{
    EventEmitter.call(this);

    this.name    = name;
    this.players = new Collection([], 'name');
    this.warmup  = null;
}

BaseRoom.prototype = Object.create(EventEmitter.prototype);

BaseRoom.prototype.warmupTime = 5000;

/**
 * Add player
 *
 * @param {Player} player
 */
BaseRoom.prototype.addPlayer = function(player)
{
    return this.players.add(player);
};

/**
 * Remove player
 *
 * @param {Player} player
 */
BaseRoom.prototype.removePlayer = function(player)
{
    return this.players.remove(player);
};

/**
 * Is ready
 *
 * @return {Boolean}
 */
BaseRoom.prototype.isReady = function()
{
    return /*this.players.count() > 1 &&*/ this.players.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Start warmpup
 */
BaseRoom.prototype.newGame = function()
{
    if (!this.game) {
        this.game = new Game(this);
        this.emit('game:new', {room: this, game: this.game});
    }

    return this.game;
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseRoom.prototype.serialize = function()
{
    return {
        name: this.name,
        players: this.players.map(function () { return this.serialize(); }).items,
        game: this.game ? true : false
    };
};

/**
 * BaseTrail
 */
function BaseTrail(color, radius)
{
    EventEmitter.call(this);

    this.color  = color;
    this.radius = radius;
    this.points = [];
}

BaseTrail.prototype = Object.create(EventEmitter.prototype);

/**
 * Add point
 *
 * @param {Array} point
 */
BaseTrail.prototype.addPoint = function(point)
{
    this.points.push(point);
};

/**
 * get last point
 *
 * @return {Array}
 */
BaseTrail.prototype.getLast = function()
{
    return this.points.length ? this.points[this.points.length - 1] : null;
};

/**
 * Clear
 *
 * @param {Array} point
 */
BaseTrail.prototype.clear = function()
{
    this.points = [];
};
/**
 * Game Controller
 */
function GameController(io)
{
    this.io    = io;
    this.games = new Collection([], 'name');
}

/**
 * Add game
 *
 * @param {Game} game
 */
GameController.prototype.addGame = function(game)
{
    var controller = this;

    if (this.games.add(game)) {
        game.on('round:new', function () { controller.onRoundNew(this); });
        game.on('round:end', function (data) { controller.onRoundEnd(this, data); });
        game.on('end', function () { controller.onEnd(this); });
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client, game)
{
    client.joinGame(game);
    this.attachEvents(client);
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detach = function(client)
{
    this.detachEvents(client);

    if (client.room && client.room.game) {
        this.io.sockets.in(client.room.game.channel).emit('game:leave', {avatar: client.avatar.name});
        client.leaveGame();
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachEvents = function(client)
{
    var controller = this;

    client.socket.on('loaded', function (data) { controller.onGameLoaded(client); });
    client.socket.on('player:move', function (data) { controller.onMove(client, data); });

    client.avatar.on('die', function () { controller.onDie(client); });
    client.avatar.on('angle', function (point) { controller.onAngle(client, point); });
    client.avatar.on('position', function (point) { controller.onPosition(client, point); });
    client.avatar.on('point', function (data) { controller.onPoint(client, data.point); });
    client.avatar.on('score', function (data) { controller.onScore(client, data); });
    client.avatar.trail.on('clear', function (data) { controller.onTrailClear(client); });
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detachEvents = function(client)
{
    client.socket.removeAllListeners('loaded');
    client.socket.removeAllListeners('channel');
    client.socket.removeAllListeners('player:move');

    client.avatar.removeAllListeners('die');
    client.avatar.removeAllListeners('position');
    client.avatar.removeAllListeners('point');
    client.avatar.removeAllListeners('score');
    client.avatar.trail.removeAllListeners('clear');
};

/**
 * On game loaded
 *
 * @param {SocketClient} client
 */
GameController.prototype.onGameLoaded = function(client)
{
    client.avatar.ready = true;

    var avatar;

    for (var i = client.game.avatars.ids.length - 1; i >= 0; i--) {
        avatar = client.game.avatars.items[i];
        this.io.sockets.in(client.room.game.channel).emit('position', {avatar: avatar.name, point: avatar.head});
        this.io.sockets.in(client.room.game.channel).emit('angle', {avatar: avatar.name, angle: avatar.angle});
    }

    console.log("emit");

    client.socket.emit('me', {avatar: client.avatar.name});

    if (client.room.game.isReady()) {
        client.room.game.newRound();
    }
};

/**
 * On move
 *
 * @param {SocketClient} client
 * @param {Number} move
 */
GameController.prototype.onMove = function(client, move)
{
    client.avatar.setAngularVelocity(move);
};

/**
 * On position
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onPosition = function(client, point)
{
    this.io.sockets.in(client.room.game.channel).emit('position', {avatar: client.avatar.name, point: point});
};

/**
 * On angle
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onAngle = function(client, angle)
{
    this.io.sockets.in(client.room.game.channel).emit('angle', {avatar: client.avatar.name, angle: angle});
};

/**
 * On point
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onPoint = function(client, point)
{
    this.io.sockets.in(client.room.game.channel).emit('point', {avatar: client.avatar.name, point: point});
};

/**
 * On die
 *
 * @param {SocketClient} client
 */
GameController.prototype.onDie = function(client)
{
    this.io.sockets.in(client.room.game.channel).emit('die', {avatar: client.avatar.name});
};

/**
 * On score
 *
 * @param {SocketClient} client
 */
GameController.prototype.onScore = function(client, data)
{
    this.io.sockets.in(client.room.game.channel).emit('score', {avatar: client.avatar.name, score: data.score});
};

/**
 * On point
 *
 * @param {SocketClient} client
 * @param {Array} point
 */
GameController.prototype.onTrailClear = function(client)
{
    this.io.sockets.in(client.room.game.channel).emit('trail:clear', {avatar: client.avatar.name});
};

// Game events:

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundNew = function(game)
{
    this.io.sockets.in(game.channel).emit('round:new');
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onRoundEnd = function(game, data)
{
    this.io.sockets.in(game.channel).emit('round:end');
};

/**
 * On round new
 *
 * @param {Game} game
 */
GameController.prototype.onEnd = function(game)
{
    this.io.sockets.in(game.channel).emit('end');
};

/**
 * Room Controller
 */
function RoomController(io, repository, gameController)
{
    this.io             = io;
    this.repository     = repository;
    this.gameController = gameController;
}

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attach = function(client)
{
    var rooms = this.repository.all();

    this.attachEvents(client);

    for (var i = rooms.length - 1; i >= 0; i--) {
        client.socket.emit('room:new', rooms[i].serialize());
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detach = function(client)
{
    this.detachEvents(client);

    if (client.room) {
        if (client.room.game) {
            this.gameController.detach(client, client.room.game);
        }

        this.io.sockets.in('rooms').emit('room:leave', {room: client.room.name, player: client.player.name});
        client.leaveRoom();
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attachEvents = function(client)
{
    var controller = this;

    client.socket.on('room:create', function (data, callback) { controller.onCreateRoom(client, data, callback); });
    client.socket.on('room:join', function (data, callback) { controller.onJoinRoom(client, data, callback); });
    client.socket.on('room:leave', function (data, callback) { controller.onLeaveRoom(client, data, callback); });
    client.socket.on('room:ready', function (data, callback) { controller.onReadyRoom(client, data, callback); });
    client.socket.on('room:color', function (data, callback) { controller.onColorRoom(client, data, callback); });
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detachEvents = function(client)
{
    client.socket.removeAllListeners('room:create');
    client.socket.removeAllListeners('room:join');
    client.socket.removeAllListeners('room:leave');
    client.socket.removeAllListeners('room:ready');
    client.socket.removeAllListeners('room:color');
};

// Events:

/**
 * On new room
 *
 * @param {String} name
 * @param {Function} callback
 */
RoomController.prototype.onCreateRoom = function(client, data, callback)
{
    var room = this.repository.create(data.name);

    callback({success: room ? true : false, room: room? room.name : null});

    if (room) {
        this.io.sockets.in('rooms').emit('room:new', room.serialize());
    }
};

/**
 * On join room
 *
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onJoinRoom = function(client, data, callback)
{
    var room = this.repository.get(data.room),
        result = false;

    if (room) {
        result = client.joinRoom(room, data.player);
    }

    callback({success: result});

    if (result) {
        this.io.sockets.in('rooms').emit('room:join', {room: room.name, player: client.player.serialize()});
    }
};

/**
 * On leave room
 *
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onLeaveRoom = function(client, data, callback)
{
    var result = client.leaveRoom();

    callback({success: result});

    if (result) {
        this.io.sockets.in('rooms').emit('room:leave', {room: room.name, player: player.name});
    }
};

/**
 * On new room
 *
 * @param {Object} data
 */
RoomController.prototype.onColorRoom = function(client, data, callback)
{
    client.player.setColor(data.color);

    callback({success: true, color: client.player.color});

    this.io.sockets.in('rooms').emit('room:player:color', {
        room: client.room.name,
        player: client.player.name,
        color: client.player.color
    });
};

/**
 * On new room
 *
 * @param {Object} data
 */
RoomController.prototype.onReadyRoom = function(client, data, callback)
{
    client.player.toggleReady();

    callback({success: true, ready: client.player.ready});

    this.io.sockets.in('rooms').emit('room:player:ready', {
        room: client.room.name,
        player: client.player.name,
        ready: client.player.ready
    });

    if (client.room.isReady()) {
        this.warmupRoom(client.room);
    }
};

/**
 * Warmup room
 *
 * @param {Room} room
 */
RoomController.prototype.warmupRoom = function(room)
{
    this.io.sockets.in('rooms').emit('room:start', {room: room.name});

    this.gameController.addGame(room.newGame());

    for (var i = room.players.ids.length - 1; i >= 0; i--) {
        this.detachEvents(room.players.items[i].client);
        this.gameController.attach(room.players.items[i].client, room.game);
    }
};


/**
 * Island
 */
function Island(id,  size, from)
{
    this.id      = id;
    this.size    = size;
    this.from    = [from[0], from[1]];
    this.to      = [this.from[0] + size, this.from[1] + size];
    this.circles = [];
}

/**
 * Add circle
 *
 * @param {Array} circle
 */
Island.prototype.addCircle = function(circle)
{
    this.circles.push(circle);
};

/**
 * Add circle
 *
 * @param {Array} circle
 */
Island.prototype.testCircle = function(circle)
{
    if (!this.circleInBound(circle, this.from, this.to)) {
        return false;
    }

    for (var i = this.circles.length - 1; i >= 0; i--)
    {
        if (this.circlesTouch(this.circles[i], circle)) {
            return false;
        }
    }

    return true;
};

/**
 * Circles touch
 *
 * @param {Array} circleA
 * @param {Array} circleB
 *
 * @return {Boolean}
 */
Island.prototype.circlesTouch = function(circleA, circleB)
{
    return this.getDistance(circleA, circleB) < (circleA[2] + circleB[2])
        && (circleA[3] && circleB[3] ? circleA[3] !== circleB[3] : true);
};

/**
 * Is point in bound?
 *
 * @param {Array} circle
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
Island.prototype.circleInBound = function(circle, from, to)
{
    return circle[0] + circle[2] >= from[0]
        && circle[0] - circle[2] <= to[0]
        && circle[1] + circle[2] >= from[1]
        && circle[1] - circle[2] <= to[1]
};

/**
 * get Distance
 *
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
Island.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};

/**
 * Random Position
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
Island.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        point = this.getRandomPoint(margin);

    while (!this.testCircle([point[0], point[1], margin, 0])) {
        point = this.getRandomPoint(margin);
    }

    return point;
};

/**
 * Get random point
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
Island.prototype.getRandomPoint = function(margin)
{
    return [
        margin + Math.random() * (this.size - margin * 2),
        margin + Math.random() * (this.size - margin * 2)
    ]
};

/**
 * Clear the world
 */
Island.prototype.clear = function()
{
    this.circles = [];
};
/**
 * Server
 */
function Server(config)
{
    this.config       = config;
    this.app          = express();
    this.server       = http.Server(this.app);
    this.io           = io(this.server);

    this.roomRepository = new RoomRepository(this.io);
    this.gameController = new GameController(this.io);
    this.roomController = new RoomController(this.io, this.roomRepository, this.gameController);

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.io.on('connection', this.onSocketConnection);
    this.app.use(express.static('web'));

    this.server.listen(config.port, function() { console.log('Listening on: %d' + config.port); });
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketConnection = function(socket)
{
    console.log('Client connected', socket.id);

    var server = this,
        client = new SocketClient(socket);

    socket.on('disconnect', function () { server.onSocketDisconnection(client); });

    this.roomController.attach(client);
};

/**
 * On socket connection
 *
 * @param {SocketClient} client
 */
Server.prototype.onSocketDisconnection = function(client)
{
    console.log('Client disconnected', client.socket.id);

    this.roomController.detach(client);
};
/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket)
{
    this.id     = socket.id;
    this.socket = socket;
    this.player = new Player(this, this.id);
    this.room   = null;
    this.game   = null;
    this.avatar = null;

    this.onChannel = this.onChannel.bind(this);

    this.socket.on('channel', this.onChannel);
    this.socket.emit('open');
}

SocketClient.prototype = Object.create(EventEmitter.prototype);

/**
 * On channel change
 *
 * @param {String} channel
 */
SocketClient.prototype.onChannel = function(channel)
{
    console.log("%s switching to channel: %s", this.socket.id, channel);
    this.socket.join(channel);
};

/**
 * Join room
 *
 * @param {Room} room
 * @param {String} name
 *
 * @return {Boolean}
 */
SocketClient.prototype.joinRoom = function(room, name)
{
    if (this.room) {
        this.leaveRoom();
    }

    this.room = room;

    this.player.setName(name);
    this.player.toggleReady(false);

    return this.room.addPlayer(this.player);
};

/**
 * Leave room
 *
 * @return {[type]}
 */
SocketClient.prototype.leaveRoom = function()
{
    if (this.room && this.room.removePlayer(this.player)) {
        this.player.toggleReady(false);
        this.room = null;
    }
};

/**
 * Join game
 *
 * @param {Game} game
 */
SocketClient.prototype.joinGame = function(game)
{
    if (this.game) {
        this.leaveGame();
    }

    this.game   = game;
    this.avatar = game.avatars.getById(this.player.name);
};

/**
 * Leave room
 */
SocketClient.prototype.leaveGame = function()
{
    if (this.game && this.game.removeAvatar(this.avatar)) {
        this.game   = null;
        this.avatar = null;
    }
};
/**
 * World
 */
function World(size)
{
    this.size       = size;
    this.from       = [0, 0];
    this.to         = [size, size];
    this.islands    = new Collection();
    this.islandSize = this.size / this.islandGridSize;

    var x, y, id;

    for (y = this.islandGridSize - 1; y >= 0; y--) {
        for (x = this.islandGridSize - 1; x >= 0; x--) {
            id = x.toString() + ':' + y.toString();
            this.islands.add(new Island(id, this.islandSize, [x * this.islandSize, y * this.islandSize]));
        }
    }
}

/**
 * Island grid size
 *
 * @type {Number}
 */
World.prototype.islandGridSize = 4;

/**
 * Get island by point
 *
 * @param {Array} point
 *
 * @return {Island}
 */
World.prototype.getIslandByPoint = function(point)
{
    var x = Math.floor(point[0]/this.islandSize),
        y = Math.floor(point[1]/this.islandSize),
        id = x.toString() + ':' + y.toString();

    return this.islands.getById(id);
};

/**
 * Get island by circle
 *
 * @param {Array} circle
 *
 * @return {Island}
 */
World.prototype.getIslandsByCircle = function(circle)
{
    var islands = new Collection(),
        sources = [
            this.getIslandByPoint([circle[0] - circle[2], circle[1] - circle[2]]),
            this.getIslandByPoint([circle[0] + circle[2], circle[1] - circle[2]]),
            this.getIslandByPoint([circle[0] - circle[2], circle[1] + circle[2]]),
            this.getIslandByPoint([circle[0] + circle[2], circle[1] + circle[2]]),
        ];

    for (var i = sources.length - 1; i >= 0; i--) {
        if (sources[i]) {
            islands.add(sources[i]);
        }
    }

    return islands.items;
};

/**
 * Add circle
 *
 * @param {Array} circle
 */
World.prototype.addCircle = function(circle)
{
    var islands = this.getIslandsByCircle(circle);

    for (var i = islands.length - 1; i >= 0; i--) {
        islands[i].addCircle(circle);
    }
};

/**
 * Add circle
 *
 * @param {Array} circle
 */
World.prototype.testCircle = function(circle)
{
    if (!this.circleInBound(circle, this.from, this.to)) {
        return false;
    }

    var islands = this.getIslandsByCircle(circle);

    for (var i = islands.length - 1; i >= 0; i--) {
        if (!islands[i].testCircle(circle)) {
            return false;
        }
    }

    return true;
};

/**
 * Is point in bound?
 *
 * @param {Array} circle
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
World.prototype.circleInBound = function(circle, from, to)
{
    return circle[0] - circle[2] >= from[0]
        && circle[0] + circle[2] <= to[0]
        && circle[1] - circle[2] >= from[1]
        && circle[1] + circle[2] <= to[1]
};

/**
 * Random Position
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
World.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        point = this.getRandomPoint(margin);

    while (!this.testCircle([point[0], point[1], margin, 0])) {
        point = this.getRandomPoint(margin);
    }

    return point;
};

/**
 * Get random point
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
World.prototype.getRandomPoint = function(margin)
{
    return [
        margin + Math.random() * (this.size - margin * 2),
        margin + Math.random() * (this.size - margin * 2)
    ]
};

/**
 * Clear the world
 */
World.prototype.clear = function()
{
    for (var i = this.islands.items.length - 1; i >= 0; i--) {
        this.islands.items[i].clear();
    }
};
/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);
}

Avatar.prototype = Object.create(BaseAvatar.prototype);

/**
 * Update
 */
Avatar.prototype.update = function(step)
{
    if (this.alive) {
        this.updateAngle(step);
        this.updatePosition(step);

        if (this.printing && (!this.trail.getLast() || this.getDistance(this.trail.getLast(), this.head) > this.precision)) {
            this.addPoint(this.head.slice(0));
        }
    }

    return BaseAvatar.prototype.update.call(this);
};

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setPosition = function(point)
{
    BaseAvatar.prototype.setPosition.call(this, point);
    this.emit('position', point);
};

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setAngle = function(angle)
{
    BaseAvatar.prototype.setAngle.call(this, angle);
    this.emit('angle', angle);
};

/**
 * Add point
 *
 * @param {Array} point
 */
Avatar.prototype.addPoint = function(point)
{
    BaseAvatar.prototype.addPoint.call(this, point);
    this.emit('point', {point: point, avatar: this});
};

/**
 * Die
 */
Avatar.prototype.die = function()
{
    BaseAvatar.prototype.die.call(this);
    this.emit('die', {avatar: this});
};

/**
 * Set score
 *
 * @param {Number} score
 */
Avatar.prototype.setScore = function(score)
{
    BaseAvatar.prototype.setScore.call(this, score);

    this.emit('score', {avatar: this, score: this.score});
};
/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world  = new World(this.size);
    this.end    = false;
    this.deaths = [];

    this.addPoint = this.addPoint.bind(this);
    this.onDie    = this.onDie.bind(this);

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].on('point', this.addPoint);
        this.avatars.items[i].on('die', this.onDie);
        this.avatars.items[i].setMask(i+1);
    }
}

Game.prototype = Object.create(BaseGame.prototype);

/**
 * Trail latency
 *
 * @type {Number}
 */
Game.prototype.trailLatency = 150;

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
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    var result = BaseGame.prototype.removeAvatar.call(this, avatar);

    this.checkRoundEnd();

    return result;
};

/**
 * Add point
 *
 * @param {Object} data
 */
Game.prototype.addPoint = function(data)
{
    var world = this.world,
        circle = [data.point[0], data.point[1], data.avatar.radius, data.avatar.mask];

    setTimeout(function () { circle[3] = 0; }, this.trailLatency);

    world.addCircle(circle);
};

/**
 * Is done
 *
 * @return {Boolean}
 */
Game.prototype.isWon = function()
{
    var game = this,
        winner = this.avatars.match(function () { return this.score >= game.maxScore; });

    return winner ? winner : false;
};

/**
 * Add point
 *
 * @param {Object} data
 */
Game.prototype.onDie = function(data)
{
    this.deaths.push(data.avatar);

    this.checkRoundEnd();
};

/**
 * Check if the round should end
 */
Game.prototype.checkRoundEnd = function()
{
    if (this.end) {
        return;
    }

    var alivePlayers = this.avatars.filter(function () { return this.alive; });

    if (alivePlayers.count() <= 1) {
        this.end = true;
        this.setScores();
        setTimeout(this.endRound, this.warmdownTime);
    }
};

/**
 * Is ready
 *
 * @return {Boolean}
 */
Game.prototype.isReady = function()
{
    return this.avatars.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Set scores
 */
Game.prototype.setScores = function()
{
    if (this.end) {
        var deaths = this.deaths.length,
            total = this.avatars.count();

        for (var i = deaths - 1; i >= 0; i--) {
            this.deaths[i].addScore(i + 1);
        }

        if (deaths < total) {
            var victor = this.avatars.match(function () { return this.alive; });

            victor.addScore(total);
        }

        this.deaths = [];
    }
};

/**
 * Check end of round
 */
Game.prototype.endRound = function()
{
    BaseGame.prototype.endRound.call(this);

    this.emit('round:end');

    if (this.isWon()) {
        this.end();
    } else {
        this.newRound();
    }
};

/**
 * New round
 */
Game.prototype.newRound = function()
{
    var avatar;

    this.emit('round:new');

    this.world.clear();

    this.end    = false;
    this.deaths = [];

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.clear();
        avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
        avatar.setAngle(Math.random() * Math.PI * 2);
    }

    BaseGame.prototype.newRound.call(this);
};

/**
 * Start
 */
Game.prototype.start = function()
{
    if (!this.frame) {
        for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
            setTimeout(this.avatars.items[i].togglePrinting, 3000);
        }
    }

    BaseGame.prototype.start.call(this);
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    this.world.clear();

    this.emit('end');

    BaseGame.prototype.end.call(this);
};

Player.prototype = Object.create(BasePlayer.prototype);
Player.prototype.constructor = Player;

/**
 * Player
 *
 * @param {SocketClient} client
 * @param {String} name
 * @param {String} color
 */
function Player(client, name, color, mail)
{
    BasePlayer.call(this, name, color, mail);

    this.client = client;
}
/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);
}

Room.prototype = Object.create(BaseRoom.prototype);
/**
 * Trail
 */
function Trail(color, radius)
{
    BaseTrail.call(this, color, radius);
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Clear
 */
Trail.prototype.clear = function()
{
    BaseTrail.prototype.clear.call(this);
    this.emit('clear');
};
/**
 * Room Repository
 */
function RoomRepository()
{
    this.rooms = new Collection([], 'name');

    this.create('elao');
}

/**
 * Create a room
 *
 * @param {String} name
 *
 * @return {Room}
 */
RoomRepository.prototype.create = function(name)
{
    var room = new Room(name);

    return this.rooms.add(room) ? room : null;
}

/**
 * Get by name
 *
 * @param {String} name
 *
 * @return {Room}
 */
RoomRepository.prototype.get = function(name)
{
    return this.rooms.getById(name);
};

/**
 * Get all
 *
 * @return {Array}
 */
RoomRepository.prototype.all = function()
{
    return this.rooms.items;
};
module.exports = new Server({
    port: 8080
});