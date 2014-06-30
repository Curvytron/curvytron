var EventEmitter = require('events').EventEmitter,
    http = require('http'),
    express = require('express'),
    WebSocket = require('faye-websocket');
/**
 * Log10 approximation
 *
 * @param x
 * @returns {number}
 */
function log10(x) {
    return Math.log(x) / Math.LN10;
}
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
    this.key   = typeof(key) !== 'undefined' && key ? key : 'id';
    this.index = typeof(index) !== 'undefined' && index;

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
 * Clear
 */
Collection.prototype.clear = function()
{
    this.ids   = [];
    this.items = [];

    if (this.index) {
        this.id = 1;
    }
};

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
    if (this.index && (typeof(element[this.key]) === 'undefined' || element[this.key] === null)) {
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
    return typeof(this.items[index]) !== 'undefined' ? this.items[index] : null;
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
 * Test if the given index exists is in the collection
 *
 * @param {String} index
 *
 * @return {Boolean}
 */
Collection.prototype.indexExists = function(index)
{
    return this.ids.indexOf(index) >= 0;
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
    this.element = typeof(element) !== 'undefined' ? element : null;

    this.update = this.update.bind(this);
    this.log    = this.log.bind(this);

    this.start();
}

/**
 * Update
 *
 * @param {Number} step
 */
FPSLogger.prototype.update = function(step)
{
    var fps = step > 0 ? 1000/step : 60;

    this.fps = ~~ (0.5 + (this.fps ? (this.fps + fps)/2 : fps));
};

/**
 * Log
 */
FPSLogger.prototype.log = function()
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
    }
};

/**
 * Start
 */
FPSLogger.prototype.start = function()
{
    if (!this.interval) {
        this.interval = setInterval(this.log, 1000);
    }
};

/**
 * Stop
 */
FPSLogger.prototype.stop = function()
{
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
    }
};
/**
 * Base Socket Client
 *
 * @param {Object} socket
 * @param {Number} interval
 */
function BaseSocketClient(socket, interval)
{
    EventEmitter.call(this);

    this.socket        = socket;
    this.interval      = typeof(interval) === 'number' ? interval : 0;
    this.events        = [];
    this.callbackQueue = [];
    this.callbacks     = [];
    this.loop          = null;
    this.empty         = 0;

    this.flush     = this.flush.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.ping      = this.onPing.bind(this);

    this.socket.onmessage = this.onMessage;

    this.attachEvents();
    this.start();
}

BaseSocketClient.prototype = Object.create(EventEmitter.prototype);

/**
 * Event prefix
 *
 * @type {String}
 */
BaseSocketClient.prototype.eventPrefix = 'evt/';

/**
 * Callback prefix
 *
 * @type {String}
 */
BaseSocketClient.prototype.callbackPrefix = 'clb/';

/**
 * Set interval
 *
 * @param {[type]} interval
 */
BaseSocketClient.prototype.setInterval = function(interval)
{
    this.stop();
    this.flush();

    this.interval = typeof(interval) === 'number' ? interval : 0;

    this.start();
};

/**
 * Start
 */
BaseSocketClient.prototype.start = function()
{
    if (this.interval && !this.loop) {
        this.loop = setInterval(this.flush, this.interval);
        this.flush();
    }
};

/**
 * Stop
 */
BaseSocketClient.prototype.stop = function()
{
    if (this.loop) {
        clearInterval(this.loop);
        this.loop = null;
    }
};

/**
 * Attach events
 */
BaseSocketClient.prototype.attachEvents = function()
{
    this.on('ping', this.onPing);
};

/**
 * Detach Events
 */
BaseSocketClient.prototype.detachEvents = function()
{
    this.removeListener('ping', this.onPing);
};

/**
 * Add an event to the list
 *
 * @param {String} name
 * @param {Object} data
 * @param {Function} callback
 * @param {Boolean} force
 */
BaseSocketClient.prototype.addEvent = function (name, data, callback, force)
{
    var event = [this.eventPrefix + name];

    if (typeof(data) !== 'undefined') {
        event[1] = data;
    }

    if (typeof(callback) !== 'undefined') {
        this.callbacks.push(callback);
        event[2] = this.callbacks.indexOf(callback);
    }

    if (!this.interval || (typeof(force) !== 'undefined' && force)) {
        this.sendEvents([event]);
    } else {
        this.events.push(event);
        this.start();
    }
};

/**
 * Add an event to the list
 *
 * @param {Array} events
 * @param {Boolean} force
 */
BaseSocketClient.prototype.addEvents = function (sources, force)
{
    var length = sources.length,
        events = [],
        event;

    for (var i = 0; i < length; i++) {
        event = [this.eventPrefix + sources[i][0]];

        if (typeof(sources[i][1]) != 'undefined') {
            event[1] = sources[i][1];
        }

        if (typeof(sources[i][2]) != 'undefined') {
            this.callbacks.push(sources[i][2]);
            event[2] = this.callbacks.indexOf(sources[i][2]);
        }

        events.push(event);
    }

    if (!this.interval || force) {
        this.sendEvents(events);
    } else {
        Array.prototype.push.apply(this.events, events);
        this.start();
    }
};

/**
 * Add a callback
 *
 * @param {Number} id
 * @param {Object} data
 */
BaseSocketClient.prototype.addCallback = function (id, data)
{
    var event = [this.callbackPrefix + id];

    if (typeof(data) !== 'undefined') {
        event[1] = data;
    }

    if (!this.interval || (typeof(force) !== 'undefined' && force)) {
        this.sendEvents([event]);
    } else {
        this.events.push(event);
        this.start();
    }
};

/**
 * Send an event
 *
 * @param {String} name
 * @param {String} data
 */
BaseSocketClient.prototype.sendEvents = function (events)
{
    this.socket.send(JSON.stringify(events));
};

/**
 * Send Events
 */
BaseSocketClient.prototype.flush = function ()
{
    if (this.events.length > 0) {
        this.sendEvents(this.events);
        this.events = [];
    }
};

/**
 * On message
 *
 * @param {Event} event
 */
BaseSocketClient.prototype.onMessage = function (event)
{
    var data = JSON.parse(event.data),
        length = data.length,
        item, index, name, isEvent;

    for (var i = 0; i < length; i++) {

        isEvent = data[i][0].substr(0, this.eventPrefix.length) === this.eventPrefix;
        name = data[i][0].substr(this.eventPrefix.length);

        if (isEvent) {
            if (typeof(data[i][2]) == 'number') {
                this.emit(name, {data: data[i][1], callback: this.createCallback(data[i][2])});
            } else {
                this.emit(name, data[i][1]);
            }
        } else {
            id = parseInt(name);

            if(typeof(this.callbacks[id]) != 'undefined') {
                this.callbacks[id](typeof(data[i][1]) !== 'undefined' ? data[i][1] : null);
                this.callbacks.splice(id, 1);
            }
        }
    }
};

/**
 * Create callback
 *
 * @param {Number} id
 *
 * @return {Function}
 */
BaseSocketClient.prototype.createCallback = function(id)
{
    var client = this;

    return function (data) { client.addCallback(id, data); };
};

/**
 * On ping
 *
 * @param {Number} ping
 */
BaseSocketClient.prototype.onPing = function (ping)
{
    this.addEvent('pong', ping);
};
/**
 * Base Bonus Manager
 */
function BaseBonusManager(game)
{
    EventEmitter.call(this);

    this.game    = game;
    this.bonuses = new Collection([], 'id', true);

    this.clear = this.clear.bind(this);
}

BaseBonusManager.prototype = Object.create(EventEmitter.prototype);

BaseBonusManager.prototype.bonusCap         = 20;
BaseBonusManager.prototype.bonusPoppingRate = 0.2;
BaseBonusManager.prototype.bonusPopingTime  = 1000;

/**
 * Start
 */
BaseBonusManager.prototype.start = function() {};

/**
 * Stop
 */
BaseBonusManager.prototype.stop = function()
{
    this.clear();
};

/**
 * Add bonus
 *
 * @param {Bonus} bonus
 */
BaseBonusManager.prototype.add = function(bonus)
{
    return this.bonuses.add(bonus);
};


/**
 * Remove bonus
 *
 * @param {Bonus} bonus
 */
BaseBonusManager.prototype.remove = function(bonus)
{
    bonus.clear();

    return this.bonuses.remove(bonus);
};

/**
 * Clear bonuses
 */
BaseBonusManager.prototype.clear = function()
{
    for (var i = this.bonuses.items.length - 1; i >= 0; i--) {
        this.bonuses.items[i].clear();
    }

    this.bonuses.clear();
};

/**
 * Get random bonus
 *
 * @param {Array} position
 *
 * @return {Bonus}
 */
BaseBonusManager.prototype.getRandomBonus = function(position)
{
    var type = this.bonusTypes[Math.floor(Math.random() * this.bonusTypes.length)];

    return new type(position);
};

/**
 * Base Avatar
 *
 * @param {Player} player
 */
function BaseAvatar(player)
{
    EventEmitter.call(this);

    this.name            = player.name;
    this.color           = player.color;
    this.player          = player;
    this.radius          = this.defaultRadius;
    this.head            = [this.radius, this.radius];
    this.trail           = new Trail(this);
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
BaseAvatar.prototype.velocity            = 18;
BaseAvatar.prototype.velocityStep        = 6;
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
    this.angularVelocity = factor * this.angularVelocityBase;
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
BaseAvatar.prototype.setAngle = function(angle)
{
    this.angle = angle;
    this.updateVelocities();
};

/**
 * Update
 *
 * @param {Number} step
 */
BaseAvatar.prototype.update = function(step) {};

/**
 * Add angle
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updateAngle = function(step)
{
    if (this.angularVelocity) {
        this.setAngle(this.angle + this.angularVelocity * step);
    }
};

/**
 * Update position
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updatePosition = function(step)
{
    this.setPosition([
        this.head[0] + this.velocities[0] * step,
        this.head[1] + this.velocities[1] * step
    ]);
};

/**
 * Upgrade velocity
 */
BaseAvatar.prototype.upVelocity = function()
{
    this.velocity += this.velocityStep;
    console.log(this.velocity);
    this.updateVelocities();
};

/**
 * Downgrade velocity
 */
BaseAvatar.prototype.downVelocity = function()
{
    if (this.velocity > this.velocityStep) {
        this.velocity -= this.velocityStep;
        console.log(this.velocity);
        this.updateVelocities();
    }
};

/**
 * Update velocities
 */
BaseAvatar.prototype.updateVelocities = function()
{
    this.velocities = [
        Math.cos(this.angle) * this.velocity/1000,
        Math.sin(this.angle) * this.velocity/1000
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
BaseAvatar.prototype.togglePrinting = function()
{
    clearTimeout(this.printingTimeout);

    this.setPrinting(!this.printing);

    this.printingTimeout = setTimeout(this.togglePrinting, this.getRandomPrintingTime());
};

/**
 * Stop printing
 */
BaseAvatar.prototype.stopPrinting = function()
{
    clearTimeout(this.printingTimeout);

    this.setPrinting(false);
};

/**
 * Set printing
 *
 * @param {Boolean} printing
 */
BaseAvatar.prototype.setPrinting = function(printing)
{
    this.printing = printing;
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
    this.velocity        = BaseAvatar.prototype.velocity;
    this.alive           = true;
    this.printing        = false;

    this.updateVelocities();
};

/**
 * Destroy
 */
BaseAvatar.prototype.destroy = function()
{
    this.stopPrinting();
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
 * BaseBonus
 *
 * @param name
 * @param color
 */
function BaseBonus(position)
{
    EventEmitter.call(this);

    this.position = position;
    this.id       = null;
}

BaseBonus.prototype = Object.create(EventEmitter.prototype);

BaseBonus.prototype.precision = 1;
BaseBonus.prototype.type      = 'default';
BaseBonus.prototype.color     = '#7CFC00';
BaseBonus.prototype.radius    = 2.4;
BaseBonus.prototype.duration  = 3333;
BaseBonus.prototype.positive  = true;


/**
 * Clear
 *
 * @param {Array} point
 */
BaseBonus.prototype.clear = function() {};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseBonus.prototype.serialize = function ()
{
    return {
        id: this.id,
        type: this.type,
        color: this.color,
        radius: this.radius,
        position: this.position
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

    this.room         = room;
    this.name         = this.room.name;
    this.channel      = 'game:' + this.name;
    this.frame        = null;
    this.avatars      = this.room.players.map(function () { return this.getAvatar(); });
    this.size         = this.getSize(this.avatars.count());
    this.rendered     = null;
    this.maxScore     = this.getMaxScore(this.avatars.count());
    this.fps          = new FPSLogger();
    this.started      = false;
    this.bonusManager = new BonusManager(this);

    this.start    = this.start.bind(this);
    this.stop     = this.stop.bind(this);
    this.loop     = this.loop.bind(this);
    this.newRound = this.newRound.bind(this);
    this.endRound = this.endRound.bind(this);
    this.end      = this.end.bind(this);
    this.onFrame  = this.onFrame.bind(this);
}

BaseGame.prototype = Object.create(EventEmitter.prototype);

BaseGame.prototype.framerate     = 1/60 * 1000;
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
    avatar.destroy();

    var result = this.avatars.remove(avatar);

    if (this.avatars.isEmpty()) {
        this.end();
    }

    return result;
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    this.started = true;

    if (!this.frame) {
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

    this.bonusManager.stop();
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop.bind(this), this.framerate);
};

/**
 * On frame
 *
 * @param {Number} step
 */
BaseGame.prototype.onFrame = function(step)
{
    this.update(step);
    this.fps.update(step);
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
 * Get max score
 *
 * @param {Number} players
 *
 * @return {Number}
 */
BaseGame.prototype.getMaxScore = function(players)
{
    return players * 10 - 10;
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
BaseGame.prototype.isPlaying = function()
{
    return this.frame !== null;
};

/**
 * New round
 */
BaseGame.prototype.newRound = function()
{
    for (var i = this.bonusManager.bonuses.items.length - 1; i >= 0; i--) {
        this.bonusManager.bonuses.items[i].clear();
    }

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
    if (this.started) {

        this.started = false;

        this.stop();
        this.fps.stop();

        for (var i = this.avatars.items.length - 1; i >= 0; i--) {
            this.removeAvatar(this.avatars.items[i]);
        }

        this.emit('end', {game: this});
    }
};

/**
 * BasePlayer
 *
 * @param {String} client
 * @param {String} name
 * @param {String} color
 */
function BasePlayer(client, name, color, mail)
{
    EventEmitter.call(this);

    this.client = client;
    this.name   = name;
    this.color  = typeof(color) !== 'undefined' ? color : this.getRandomColor();
    this.mail   = mail;
    this.ready  = false;
    this.avatar = null;
}

BasePlayer.prototype = Object.create(EventEmitter.prototype);

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
 * Get avatar
 *
 * @return {Avatar}
 */
BasePlayer.prototype.getAvatar = function()
{
    if (!this.avatar) {
        this.avatar = new Avatar(this);
    }

    return this.avatar;
};

/**
 * Reset player after a game
 */
BasePlayer.prototype.reset = function()
{
    this.avatar.destroy();

    this.avatar = null;
    this.ready  = false;
};

/**
 * Serialize
 *
 * @return {Object}
 */
BasePlayer.prototype.serialize = function()
{
    return {
        client: this.client.id,
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
    var code = Math.floor(Math.random()*16777215).toString(16),
        miss = 6 - code.length;

    return '#' + code + (miss ? new Array(miss +1).join('0') : '');
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

/**
 * Warmup time
 *
 * @type {Number}
 */
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
 * Is name available?
 *
 * @param {String} name
 */
BaseRoom.prototype.isNameAvailable = function(name)
{
    return !this.players.indexExists(name);
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
 * Close game
 */
BaseRoom.prototype.closeGame = function()
{
    this.game = null;

    for (var i = this.players.items.length - 1; i >= 0; i--) {
        this.players.items[i].reset();
    }
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
function BaseTrail(avatar)
{
    EventEmitter.call(this);

    this.avatar = avatar;
    this.color  = this.avatar.color;
    this.radius = this.avatar.radius;
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
    this.points = [];
};
/**
 * Game Controller
 */
function GameController()
{
    var controller = this;

    this.games = new Collection([], 'name');

    this.onDie         = this.onDie.bind(this);
    this.onAngle       = this.onAngle.bind(this);
    this.onPosition    = this.onPosition.bind(this);
    this.onBonusPop    = this.onBonusPop.bind(this);
    this.onBonusClear  = this.onBonusClear.bind(this);
    this.onPrinting    = this.onPrinting.bind(this);
    this.onPoint       = this.onPoint.bind(this);
    this.onScore       = this.onScore.bind(this);
    this.onTrailClear  = this.onTrailClear.bind(this);
    this.onRoundNew    = this.onRoundNew.bind(this);
    this.onRoundEnd    = this.onRoundEnd.bind(this);
    this.onRoundWinner = this.onRoundWinner.bind(this);
    this.onEnd         = this.onEnd.bind(this);

    this.callbacks = {
        onGameLoaded: function () { controller.onGameLoaded(this); },
        onMove: function (data) { controller.onMove(this, data); },
    };
}

/**
 * Add game
 *
 * @param {Game} game
 */
GameController.prototype.addGame = function(game)
{
    if (this.games.add(game)) {
        game.on('round:new', this.onRoundNew);
        game.on('round:end', this.onRoundEnd);
        game.on('round:winner', this.onRoundWinner);

        game.bonusManager.on('bonus:pop', this.onBonusPop);
        game.bonusManager.on('bonus:clear', this.onBonusClear);

        for (var i = game.clients.items.length - 1; i >= 0; i--) {
            this.attach(game.clients.items[i], game);
        }
    }
};

/**
 * Remove game
 *
 * @param {Game} game
 */
GameController.prototype.removeGame = function(game)
{
    if (this.games.remove(game)) {
        game.removeListener('end', this.onEnd);
        game.removeListener('round:new', this.onRoundNew);
        game.removeListener('round:end', this.onRoundEnd);
        game.removeListener('round:winner', this.onRoundWinner);
        game.bonusManager.removeListener('bonus:pop', this.onBonusPop);
        game.bonusManager.removeListener('bonus:clear', this.onBonusClear);

        for (var i = game.clients.items.length - 1; i >= 0; i--) {
            this.detach(game.clients.items[i], game);
        }
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client, game)
{
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

    var avatar;

    if (client.room.game) {
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            avatar = client.players.items[i].avatar;
            client.room.game.client.addEvent('game:leave', {avatar: avatar.name});
            client.room.game.removeAvatar(avatar);
        }
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attachEvents = function(client)
{
    var controller = this,
        avatar;

    client.on('loaded', this.callbacks.onGameLoaded);
    client.on('player:move', this.callbacks.onMove);

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        avatar.on('die', this.onDie);
        avatar.on('angle', this.onAngle);
        avatar.on('position', this.onPosition);
        avatar.on('printing', this.onPrinting);
        avatar.on('point', this.onPoint);
        avatar.on('score', this.onScore);
        avatar.trail.on('clear', this.onTrailClear);
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.detachEvents = function(client)
{
    var avatar;

    client.removeListener('loaded', this.callbacks.onGameLoaded);
    client.removeListener('player:move', this.callbacks.onMove);

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        avatar.removeListener('die', this.onDie);
        avatar.removeListener('angle', this.onAngle);
        avatar.removeListener('position', this.onPosition);
        avatar.removeListener('printing', this.onPrinting);
        avatar.removeListener('point', this.onPoint);
        avatar.removeListener('score', this.onScore);
        avatar.trail.removeListener('clear', this.onTrailClear);
    }
};

/**
 * On game loaded
 *
 * @param {SocketClient} client
 */
GameController.prototype.onGameLoaded = function(client)
{
    var game = client.room.game,
        avatar;

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;
        avatar.ready = true;
    }

    if (game.isReady()) {
        game.newRound();
    }
};

/**
 * On move
 *
 * @param {SocketClient} client
 * @param {Number} move
 */
GameController.prototype.onMove = function(client, data)
{
    var player = client.players.getById(data.avatar);

    if (player && player.avatar) {
        player.avatar.setAngularVelocity(data.move);
    }
};

/**
 * On position
 *
 * @param {Object} data
 */
GameController.prototype.onPosition = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        point = data.point;

    game.client.addEvent('position', {avatar: avatar.name, point: point});
};

/**
 * On printing
 *
 * @param {Object} data
 */
GameController.prototype.onPrinting = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        printing = data.printing;

    game.client.addEvent('printing', {avatar: avatar.name, printing: printing});
};

/**
 * On angle
 *
 * @param {Object} data
 */
GameController.prototype.onAngle = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        angle = data.angle;

    if(!avatar.player.client.room.game.isPlaying()) {
        game.client.addEvent('angle', {avatar: avatar.name, angle: angle});
    }
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onPoint = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        point = data.point;

    if (data.important) {
        game.client.addEvent('point', {avatar: avatar.name, point: point});
    }
};

/**
 * On die
 *
 * @param {Object} data
 */
GameController.prototype.onDie = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game;

    game.client.addEvent('die', {avatar: avatar.name});
};

/**
 * On bonus pop
 *
 * @param {SocketClient} game
 */
GameController.prototype.onBonusPop = function(data)
{
    var game = data.game, bonus = data.bonus;

    game.client.addEvent('bonus:pop', bonus.serialize());
};

/**
 * On bonus clear
 *
 * @param {SocketClient}client
 * @param data
 */
GameController.prototype.onBonusClear = function(data)
{
    var game = data.game, bonus = data.bonus;

    game.client.addEvent('bonus:clear', {bonus: bonus.id});
};


/**
 * On score
 *
 * @param {Object} data
 */
GameController.prototype.onScore = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game,
        score = data.score;

    game.client.addEvent('score', {avatar: avatar.name, score: score});
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onTrailClear = function(data)
{
    var avatar = data.avatar,
        game = avatar.player.client.room.game;

    game.client.addEvent('trail:clear', {avatar: avatar.name});
};

// Game events:

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundNew = function(data)
{
    data.game.client.addEvent('round:new');
};

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundEnd = function(data)
{
    data.game.client.addEvent('round:end');
};

/**
 * On round winner
 *
 * @param {Object} data
 */
GameController.prototype.onRoundWinner = function(data)
{
    data.game.client.addEvent('round:winner', {winner: data.winner.name});
};

/**
 * On end
 *
 * @param {Object} data
 */
GameController.prototype.onEnd = function(data)
{
    data.game.client.addEvent('end');
};

/**
 * Room Controller
 *
 * @param {RoomRepository} repository
 * @param {GameController} gameController
 */
function RoomController(repository, gameController)
{
    var controller = this;

    this.socketGroup    = new SocketGroup();
    this.repository     = repository;
    this.gameController = gameController;

    this.endGame = this.endGame.bind(this);

    this.callbacks = {
        emitAllRooms: function () { controller.emitAllRooms(this); },
        onCreateRoom: function (data) { controller.onCreateRoom(this, data.data, data.callback); },
        onJoinRoom: function (data) { controller.onJoinRoom(this, data.data, data.callback); },
        onLeaveRoom: function () { controller.onLeaveRoom(this); },
        onAddPlayer: function (data) { controller.onAddPlayer(this, data.data, data.callback); },
        onReadyRoom: function (data) { controller.onReadyRoom(this, data.data, data.callback); },
        onColorRoom: function (data) { controller.onColorRoom(this, data.data, data.callback); }
    };
}

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attach = function(client)
{
    if (this.socketGroup.clients.add(client)) {
        this.attachEvents(client);
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detach = function(client)
{
    if (this.socketGroup.clients.remove(client)) {
        this.detachEvents(client);
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attachEvents = function(client)
{
    client.on('room:fetch', this.callbacks.emitAllRooms);
    client.on('room:create', this.callbacks.onCreateRoom);
    client.on('room:join', this.callbacks.onJoinRoom);
    client.on('room:leave', this.callbacks.onLeaveRoom);
    client.on('room:player:add', this.callbacks.onAddPlayer);
    client.on('room:ready', this.callbacks.onReadyRoom);
    client.on('room:color', this.callbacks.onColorRoom);
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detachEvents = function(client)
{
    client.removeListener('room:fetch', this.callbacks.emitAllRooms);
    client.removeListener('room:create', this.callbacks.onCreateRoom);
    client.removeListener('room:join', this.callbacks.onJoinRoom);
    client.removeListener('room:leave', this.callbacks.onLeaveRoom);
    client.removeListener('room:player:add', this.callbacks.onAddPlayer);
    client.removeListener('room:ready', this.callbacks.onReadyRoom);
    client.removeListener('room:color', this.callbacks.onColorRoom);
};

/**
 * Emit all rooms to the given client
 *
 * @param {SocketClient} client
 */
RoomController.prototype.emitAllRooms = function(client)
{
    var events = [];

    for (var i = this.repository.rooms.items.length - 1; i >= 0; i--) {
        events.push(['room:new', this.repository.rooms.items[i].serialize()]);
    }

    client.addEvents(events);
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
        this.socketGroup.addEvent('room:new', room.serialize());
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
    var room = this.repository.get(data.room);

    if (room && !room.game) {
        room.addClient(client);
        callback({success: true});
    } else {
        callback({success: false});
    }
};

/**
 * On leave room
 *
 * @param {SocketClient} client
 */
RoomController.prototype.onLeaveRoom = function(client)
{
    var room = client.room;

    if (room) {

        if (client.room.game) {
            this.gameController.detach(client);
        }

        for (var i = client.players.items.length - 1; i >= 0; i--) {
            player = client.players.items[i];
            this.socketGroup.addEvent('room:leave', {room: room.name, player: player.name});
            room.removePlayer(player);
        }

        client.players.clear();
        room.removeClient(client);
        this.checkRoomClose(room);
    }
};

/**
 * Check room closing
 *
 * @param {Room} room
 */
RoomController.prototype.checkRoomClose = function(room)
{
    if (room.clients.isEmpty() && this.repository.remove(room)) {
        this.socketGroup.addEvent('room:close', {room: room.name});
    }
};

/**
 * On add player to room
 *
 * @param client
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onAddPlayer = function(client, data, callback)
{
    var name = data.name;

    if (client.room && client.room.isNameAvailable(name)) {

        var player = new Player(client, name);

        client.room.addPlayer(player);
        client.players.add(player);

        callback({success: true});

        this.socketGroup.addEvent('room:join', {room: client.room.name, player: player.serialize()});
    } else {
        callback({success: false});
    }
};

/**
 * On new room
 *
 * @param client
 * @param data
 * @param callback
 */
RoomController.prototype.onColorRoom = function(client, data, callback)
{
    var room = client.room,
        player = client.players.getById(data.player);

    if (room && player) {
        player.setColor(data.color);

        callback({success: true, color: player.color});

        this.socketGroup.addEvent('room:player:color', {
            room: room.name,
            player: player.name,
            color: player.color
        });
    }
};

/**
 * On new room
 *
 * @param client
 * @param {Object} data
 * @param callback
 */
RoomController.prototype.onReadyRoom = function(client, data, callback)
{
    var room = client.room,
        player = client.players.getById(data.player);

    if (room && player) {
        player.toggleReady();

        callback({success: true, ready: player.ready});

        this.socketGroup.addEvent('room:player:ready', {
            room: room.name,
            player: player.name,
            ready: player.ready
        });

        if (room.isReady()) {
            this.startGame(room);
        }
    }
};

/**
 * Warmup room
 *
 * @param {Room} room
 */
RoomController.prototype.startGame = function(room)
{
    var game = room.newGame();

    this.socketGroup.addEvent('room:game:start', {room: room.name});

    for (var i = room.clients.items.length - 1; i >= 0; i--) {
        this.detach(room.clients.items[i]);
    }

    this.gameController.addGame(game);
    game.on('end', this.endGame);
};

/**
 * End game
 *
 * @param {Object} data
 */
RoomController.prototype.endGame = function(data)
{
    var game = data.game,
        room = game.room,
        client;

    this.socketGroup.addEvent('room:game:end', {room: room.name});

    this.gameController.removeGame(game);

    for (var i = room.clients.items.length - 1; i >= 0; i--) {
        client = room.clients.items[i];
        this.attach(client);
        this.emitAllRooms(client);
    }

    room.closeGame();
};

/**
 * Body
 *
 * @param {Array} position
 * @param {Number} radius
 * @param {Number} mask
 * @param {Object} data
 */
function Body (position, radius, data, mask)
{
    this.position = position;
    this.radius   = radius;
    this.data     = data;
    this.islands  = new Collection();
    this.mask     = typeof(mask) !== 'undefined' ? mask : null;
    this.id       = null;

    this.clearMask = this.clearMask.bind(this);
}

/**
 * Clear mask
 */
Body.prototype.setMask = function(mask, duration)
{
    this.mask = mask;

    if (typeof(duration) === 'number') {
        setTimeout(this.clearMask, duration);
    }
};

/**
 * Clear mask
 */
Body.prototype.clearMask = function()
{
    this.mask = null;
};

/**
 * Match mask
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
Body.prototype.matchMask = function(body)
{
    return this.mask && body.mask ? this.mask !== body.mask : true;
};

/**
 * Island
 */
function Island(id,  size, from)
{
    this.id     = id;
    this.size   = size;
    this.from   = [from[0], from[1]];
    this.to     = [this.from[0] + size, this.from[1] + size];
    this.bodies = new Collection([], 'id', true);
}

/**
 * Add body
 *
 * @param {Array} body
 */
Island.prototype.addBody = function(body)
{
    this.bodies.add(body);
    body.islands.add(this);
};

/**
 * Remove body
 *
 * @param {Array} body
 */
Island.prototype.removeBody = function(body)
{
    this.bodies.remove(body);
    body.islands.remove(this);
};


/**
 * Add body
 *
 * @param {Array} body
 */
Island.prototype.testBody = function(body)
{
    return this.getBody(body) === null;
};

/**
 * Add body
 *
 * @param {Body} body
 */
Island.prototype.getBody = function(body)
{
    if (Island.bodyInBound(body, this.from, this.to)) {
        for (var i = this.bodies.items.length - 1; i >= 0; i--) {
            if (Island.bodiesTouch(this.bodies.items[i], body)) {
                return this.bodies.items[i];
            }
        }
    }

    return null;
};

/**
 * Bodies touch
 *
 * @param {Body} bodyA
 * @param {Body} bodyB
 *
 * @return {Boolean}
 */
Island.bodiesTouch = function(bodyA, bodyB)
{
    return Island.getDistance(bodyA.position, bodyB.position) < (bodyA.radius + bodyB.radius) && bodyA.matchMask(bodyB);
};

/**
 * Is point in bound?
 *
 * @param {Body} body
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
Island.bodyInBound = function(body, from, to)
{
    return body.position[0] + body.radius >= from[0] &&
           body.position[0] - body.radius <= to[0]   &&
           body.position[1] + body.radius >= from[1] &&
           body.position[1] - body.radius <= to[1];
};

/**
 * get Distance
 *
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Number}
 */
Island.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};

/**
 * Random Position
 *
 * @param {Number} radius
 * @param border
 *
 * @returns {Array}
 */
Island.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        point = this.getRandomPoint(margin);

    while (!this.testBody(point, margin)) {
        point = this.getRandomPoint(margin);
    }

    return point;
};

/**
 * Get random point
 *
 * @param {Number} margin
 *
 * @return {Array}
 */
Island.prototype.getRandomPoint = function(margin)
{
    return [
        margin + Math.random() * (this.size - margin * 2),
        margin + Math.random() * (this.size - margin * 2)
    ];
};

/**
 * Clear the world
 */
Island.prototype.clear = function()
{
    this.bodies.clear();
};
/**
 * Server
 */
function Server(config)
{
    this.config      = config;
    this.app         = express();
    this.server      = new http.Server(this.app);
    this.clients     = new Collection([], 'id', true);

    this.roomRepository = new RoomRepository();
    this.gameController = new GameController();
    this.roomController = new RoomController(this.roomRepository, this.gameController);

    this.authorizationHandler  = this.authorizationHandler.bind(this);
    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);
    this.onError               = this.onError.bind(this);

    this.app.use(express.static('web'));

    this.server.on("error", this.onError);
    this.server.on('upgrade', this.authorizationHandler);
    this.server.listen(config.port);

    console.info('Listening on: %s', config.port);
}

/**
 * Authorization Handler
 *
 * @param {object} request
 * @param {object} socket
 * @param {Buffer} body
 */
Server.prototype.authorizationHandler = function(request, socket, head)
{
    return WebSocket.isWebSocket(request) ? this.onSocketConnection(new WebSocket(request, socket, head, ['websocket'], {ping: 5})) : socket.end();
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketConnection = function(socket)
{;

    var server = this,
        client = new SocketClient(socket, 3);

    this.clients.add(client);
    socket.on('close', function (event) { server.onSocketDisconnection(client); });

    client.addEvent('open', client.id);

    this.roomController.attach(client);

    console.log('Client connected', client.id)
};

/**
 * On socket connection
 *
 * @param {SocketClient} client
 */
Server.prototype.onSocketDisconnection = function(client)
{
    console.log('Client disconnected', client.socket.id);

    this.roomController.onLeaveRoom(client);
    this.roomController.detach(client);

    this.clients.remove(client);
    client = null;
};

/**
 * On error
 *
 * @param {Error} error */
Server.prototype.onError = function(error)
{
    console.error("Server Error:", error.stack);
};
/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket, interval)
{
    BaseSocketClient.call(this, socket, interval);

    this.players = new Collection([], 'name');
    this.id      = null;
    this.room    = null;
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
/**
 * Socket group
 *
 * @param {Object} clients
 */
function SocketGroup(clients)
{
    this.clients = typeof(clients) != 'undefined' ? clients : new Collection();
}

SocketGroup.prototype.on = function(name, callback)
{
    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.clients.items[i].on(name, callback);
    }
};

SocketGroup.prototype.removeListener = function(name, callback)
{
    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.clients.items[i].removeListener(name, callback);
    }
};

SocketGroup.prototype.addEvents = function(events, force)
{
    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.clients.items[i].addEvents(events, force);
    }
};

SocketGroup.prototype.addEvent = function(name, data, callback, force)
{
    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.clients.items[i].addEvent(name, data, callback, force);
    }
};
/**
 * World
 */
function World(size, islands)
{
    islands = typeof(islands) === 'number' ? islands : this.islandGridSize;

    this.size       = size;
    this.from       = [0, 0];
    this.to         = [size, size];
    this.islands    = new Collection();
    this.islandSize = this.size / islands;
    this.active     = false;

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
 * Get island by body
 *
 * @param {Body} body
 *
 * @return {Island}
 */
World.prototype.getIslandsByBody = function(body)
{
    var islands = new Collection(),
        sources = [
            this.getIslandByPoint([body.position[0] - body.radius, body.position[1] - body.radius]),
            this.getIslandByPoint([body.position[0] + body.radius, body.position[1] - body.radius]),
            this.getIslandByPoint([body.position[0] - body.radius, body.position[1] + body.radius]),
            this.getIslandByPoint([body.position[0] + body.radius, body.position[1] + body.radius])
        ];

    for (var i = sources.length - 1; i >= 0; i--) {
        if (sources[i]) {
            islands.add(sources[i]);
        }
    }

    return islands.items;
};

/**
 * Add body
 *
 * @param {Body} body
 */
World.prototype.addBody = function(body)
{
    if (!this.active) {
        return;
    }

    var islands = this.getIslandsByBody(body);

    for (var i = islands.length - 1; i >= 0; i--) {
        islands[i].addBody(body);
    }
};

/**
 * Remove body
 *
 * @param {Body} body
 */
World.prototype.removeBody = function(body)
{
    if (!this.active) {
        return;
    }

    for (var i = body.islands.items.length - 1; i >= 0; i--) {
        body.islands.items[i].removeBody(body);
    }
};

/**
 * Get body
 *
 * @param {Body} body
 */
World.prototype.getBody = function(body)
{
    if (!Island.bodyInBound(body, this.from, this.to)) {
        return null;
    }

    var islands = this.getIslandsByBody(body),
        match;

    for (var i = islands.length - 1; i >= 0; i--) {
        match = islands[i].getBody(body);
        if (match) {
            return match;
        }
    }

    return null;
};

/**
 * Add body
 *
 * @param {Body} body
 */
World.prototype.testBody = function(body)
{
    if (!Island.bodyInBound(body, this.from, this.to)) {
        return false;
    }

    var islands = this.getIslandsByBody(body);

    for (var i = islands.length - 1; i >= 0; i--) {
        if (!islands[i].testBody(body)) {
            return false;
        }
    }

    return true;
};

/**
 * Random Position
 *
 * @param radius
 * @param border
 *
 * @returns {Array}
 */
World.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        point = this.getRandomPoint(margin);

    while (!this.testBody(new Body(point, margin))) {
        point = this.getRandomPoint(margin);
    }

    return point;
};

/**
 * Get random point
 *
 * @param {Number} margin
 *
 * @return {Array}
 */
World.prototype.getRandomPoint = function(margin)
{
    return [
        margin + Math.random() * (this.size - margin * 2),
        margin + Math.random() * (this.size - margin * 2)
    ];
};

/**
 * Clear the world
 */
World.prototype.clear = function()
{
    for (var i = this.islands.items.length - 1; i >= 0; i--) {
        this.islands.items[i].clear();
    }

    this.active = false;
};

/**
 * Activate
 */
World.prototype.activate = function()
{
    this.active = true;
};
/**
 * Bonus Manager
 *
 * @param {Game} game
 */
function BonusManager(game)
{
    BaseBonusManager.call(this, game);

    this.world         = new World(this.game.size, 1);
    this.popingTimeout = null;
    this.timeouts      = [];

    this.popBonus = this.popBonus.bind(this);
}

BonusManager.prototype = Object.create(BaseBonusManager.prototype);

/**
 * Bonus types
 *
 * @type {Array}
 */
BonusManager.prototype.bonusTypes = [TurtleBonus, RabbitBonus];

/**
 * Start
 */
BonusManager.prototype.start = function()
{
    BaseBonusManager.prototype.start.call(this);

    this.world.activate();

    this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());
};

/**
 * Stop
 */
BonusManager.prototype.stop = function()
{
    BaseBonusManager.prototype.stop.call(this);

    clearTimeout(this.popingTimeout);
    this.popingTimeout = null;

    this.clearTimeouts();
};

/**
 * Clear
 */
BonusManager.prototype.clear = function()
{
    this.world.clear();
    BaseBonusManager.prototype.clear.call(this);
};

/**
 * Make a bonus 'pop'
 */
BonusManager.prototype.popBonus = function ()
{
    clearTimeout(this.popingTimeout);
    this.popingTimeout = null;

    if (this.bonuses.count() < this.bonusCap) {
        var position = this.game.world.getRandomPosition(BaseBonus.prototype.radius, 0.03),
            bonus = this.getRandomBonus(position);

        this.add(bonus);
    }

    this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());
};

/**
 * Test if an avatar catches a bonus
 *
 * @param {Avatar} avatar
 */
BonusManager.prototype.testCatch = function(avatar)
{
    if (!avatar.body) {
        throw avatar;
    }
    var body = this.world.getBody(avatar.body),
        bonus = body ? body.data : null;

    if (bonus && this.remove(bonus)) {
        this.timeouts.push(bonus.applyTo(avatar));
    }
};

/**
 * Add bonus
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.add = function (bonus)
{
    if (BaseBonusManager.prototype.add.call(this, bonus)) {
        this.world.addBody(bonus.body);
        this.emit('bonus:pop', { game: this.game, bonus: bonus });

        return true;
    }

    return false;
};

/**
 *  Remove bonus
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.remove = function(bonus)
{
    if (BaseBonusManager.prototype.remove.call(this, bonus)) {
        this.world.removeBody(bonus.body);
        this.emit('bonus:clear', {game: this.game, bonus: bonus});

        return true;
    }

    return false;
}

/**
 * Clear timeouts
 */
BonusManager.prototype.clearTimeouts = function()
{
    for (var i = this.timeouts.length - 1; i >= 0; i--) {
        clearTimeout(this.timeouts[i]);
    }

    this.timeouts = [];
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
BonusManager.prototype.getRandomPopingTime  = function()
{
    return this.bonusPopingTime * (1 +  Math.random() * 2);
};

/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.game = null;
    this.body = new Body(this.head, this.radius, this);
}

Avatar.prototype = Object.create(BaseAvatar.prototype);

/**
 * Update
 *
 * @param step
 * @returns {*}
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
 * Set mask
 *
 * @param {Number} mask
 */
Avatar.prototype.setMask = function(mask)
{
    BaseAvatar.prototype.setMask.call(this, mask);

    this.body.setMask(this.mask);
};

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setPosition = function(point)
{
    BaseAvatar.prototype.setPosition.call(this, point);

    this.body.position = this.head;

    this.emit('position', {avatar: this, point: this.head});
};

/**
 * Set angle
 *
 * @param {Array} point
 */
Avatar.prototype.setAngle = function(angle)
{
    BaseAvatar.prototype.setAngle.call(this, angle);
    this.emit('angle', {avatar: this, angle: this.angle});
};

/**
 * Add point
 *
 * @param {Array} point
 */
Avatar.prototype.addPoint = function(point, important)
{
    if (this.game.isPlaying()) {
        BaseAvatar.prototype.addPoint.call(this, point);
        important = important || this.angularVelocity;
        this.emit('point', {avatar: this, point: point, important: important});
    }
};

/**
 * Set printing
 *
 * @param {Boolean} printing
 */
Avatar.prototype.setPrinting = function(printing)
{
    if (!printing) {
        this.addPoint(this.head.slice(0), true);
    }

    BaseAvatar.prototype.setPrinting.call(this, printing);

    if (!this.printing) {
        this.trail.clear();
    }

    this.emit('printing', {avatar: this, printing: this.printing});

    if (printing) {
        this.addPoint(this.head.slice(0), true);
    }
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
 * Upgrade velocity
 */
Avatar.prototype.upVelocity = function()
{
    BaseAvatar.prototype.upVelocity.call(this);

    this.emit('velocity:up', {avatar: this});
};

/**
 * Downgrade velocity
 */
Avatar.prototype.downVelocity = function()
{
    BaseAvatar.prototype.downVelocity.call(this);

    this.emit('velocity:down', {avatar: this});
};

/**
 * Reset velocity
 */
Avatar.prototype.resetVelocity = function()
{
    BaseAvatar.prototype.resetVelocity.call(this);

    this.emit('velocity:reset', {avatar: this});
};
/**
 * Bonus
 *
 * @param {Array} position
 */
function Bonus(position)
{
    BaseBonus.call(this, position);

    this.body = new Body(this.position, this.radius, this);
}

Bonus.prototype = Object.create(BaseBonus.prototype);
/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world   = new World(this.size);
    this.inRound = false;
    this.deaths  = new Collection([], 'name');
    this.clients = this.room.clients;
    this.client  = new SocketGroup(this.clients);

    this.addPoint = this.addPoint.bind(this);
    this.onDie    = this.onDie.bind(this);

    var avatar;

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.game = this;
        avatar.clear();
        avatar.on('point', this.addPoint);
        avatar.on('die', this.onDie);
        avatar.setMask(i+1);
    }
}

Game.prototype = Object.create(BaseGame.prototype);

/**
 * Trail latency
 *
 * @type {Number}
 */
Game.prototype.trailLatency = 300;

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    BaseGame.prototype.update.call(this, step);

    var avatar, position;

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        avatar.update(step);

        if (avatar.alive) {
            if (!this.world.testBody(avatar.body)) {
                avatar.die();
            } else {
                this.bonusManager.testCatch(avatar);
            }
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

    this.deaths.remove(avatar);
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
    if (this.world.active) {
        var body = new Body(data.point, data.avatar.radius, data.avatar),
            duration = this.trailLatency * (data.avatar.velocity / BaseAvatar.prototype.velocity);

        body.setMask(data.avatar.mask, duration);
        this.world.addBody(body);
    }
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
 * On die
 *
 * @param {Object} data
 */
Game.prototype.onDie = function(data)
{
    this.deaths.add(data.avatar);

    this.checkRoundEnd();
};

/**
 * Check if the round should end
 */
Game.prototype.checkRoundEnd = function()
{
    if (!this.inRound) {
        return;
    }

    var alivePlayers = this.avatars.filter(function () { return this.alive; });

    if (alivePlayers.count() <= 1) {
        this.inRound = false;
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
    return this.avatars.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Set scores
 */
Game.prototype.setScores = function()
{
    if (this.end) {
        var total = this.avatars.count();

        for (var i = this.deaths.items.length - 1; i >= 0; i--) {
            this.deaths.items[i].addScore(i + 1);
        }

        if (this.deaths.count() < total) {
            var winner = this.avatars.match(function () { return this.alive; });

            winner.addScore(total);
            this.emit('round:winner', {game: this, winner: winner});
        }

        this.deaths.clear();
    }
};

/**
 * Check end of round
 */
Game.prototype.endRound = function()
{
    BaseGame.prototype.endRound.call(this);

    this.emit('round:end', {game: this});

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
    if (!this.inRound) {
        var avatar, i;

        this.world.clear();
        this.bonusManager.stop();

        this.inRound = true;
        this.deaths.clear();

        for (i = this.avatars.items.length - 1; i >= 0; i--) {
            avatar = this.avatars.items[i];

            avatar.clear();
            avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
            avatar.setAngle(Math.random() * Math.PI * 2);
        }

        BaseGame.prototype.newRound.call(this);

        this.emit('round:new', {game: this});
    }
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    BaseGame.prototype.onStart.call(this);

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.printingTimeout = setTimeout(avatar.togglePrinting, 3000);
    }

    this.world.activate();
    this.bonusManager.start();

    this.printing = false;
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    BaseGame.prototype.end.call(this);

    this.bonusManager.stop();
    this.world.clear();
};

/**
 * Player
 *
 * @param {SocketClient} client
 * @param {String} name
 * @param {String} color
 */
function Player(client, name, color, mail)
{
    BasePlayer.call(this, client, name, color, mail);
}

Player.prototype = Object.create(BasePlayer.prototype);
Player.prototype.constructor = Player;
/**
 * RabbitBonus
 *
 * @param color
 * @param radius
 */
function RabbitBonus(name, color, radius)
{
    BaseBonus.call(this, name, '#7CFC00', radius);

    this.path = null;
}

RabbitBonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Aplly bonus callback
 */
RabbitBonus.prototype.callback = function(avatar)
{
    avatar.upVelocity();
    return setTimeout(function() { avatar.downVelocity(); }, 3333);
};
/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);

    this.clients = new Collection();
}

Room.prototype = Object.create(BaseRoom.prototype);

/**
 * Add client
 *
 * @param {Client} client
 */
Room.prototype.addClient = function(client)
{
    if (this.clients.add(client)) {
        client.room = this;
    }
};

/**
 * Remove client
 *
 * @param {Client} client
 */
Room.prototype.removeClient = function(client)
{
    if (this.clients.remove(client)) {
        client.room = null;
    }
};
/**
 * Trail
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Clear
 */
Trail.prototype.clear = function()
{
    BaseTrail.prototype.clear.call(this);
    this.emit('clear', {avatar: this.avatar});
};
/**
 * Bonus
 *
 * @param color
 * @param radius
 */
function TurtleBonus(name, color, radius)
{
    BaseBonus.call(this, name, '#FF0000', radius);

    this.path = null;
}

TurtleBonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Aplly bonus callback
 */
TurtleBonus.prototype.callback = function(avatar)
{
    avatar.downVelocity();
    return setTimeout(function() { avatar.upVelocity(); }, 3333);
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
};

/**
 * Delete a room
 *
 * @param {Room} room
 */
RoomRepository.prototype.remove = function(room)
{
    return room.clients.isEmpty() && this.rooms.remove(room);
};

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
/**
 * Rabbit Bonus
 *
 * @param {Array} position
 */
function RabbitBonus(position)
{
    Bonus.call(this, position);
}

RabbitBonus.prototype = Object.create(Bonus.prototype);

/**
 * Type
 *
 * @type {String}
 */
RabbitBonus.prototype.type = 'rabbit';

/**
 * Aplly bonus callback
 *
 * @param {Avatar} avatar
 */
RabbitBonus.prototype.applyTo = function(avatar)
{
    console.log('apply', this.name, 'to', avatar.name);
    avatar.upVelocity();

    return setTimeout(function() { avatar.downVelocity(); }, this.duration);
};
/**
 * Turtle Bonus
 *
 * @param {Array} position
 */
function TurtleBonus(position)
{
    Bonus.call(this, position);
}

TurtleBonus.prototype = Object.create(Bonus.prototype);

/**
 * Type
 *
 * @type {String}
 */
TurtleBonus.prototype.name     = 'turtle';

TurtleBonus.prototype.color    = '#FF0000';
TurtleBonus.prototype.positive = false;

/**
 * Aplly bonus callback
 */
TurtleBonus.prototype.applyTo = function(avatar)
{
    console.log('apply', this.name, 'to', avatar.name);
    avatar.downVelocity();

    return setTimeout(function() { avatar.upVelocity(); }, this.duration);
};
module.exports = new Server({
    port: 8080
});