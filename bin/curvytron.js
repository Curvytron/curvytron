var EventEmitter = require('events').EventEmitter,
    http = require('http'),
    express = require('express'),
    io = require('socket.io');
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
    this.element = typeof(element) != 'undefined' ? element : null;

    this.update = this.update.bind(this);
    this.clear  = this.clear.bind(this);

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

    this.fps = ~~ (0.5 + (this.fps ? (this.fps + fps)/2 : fps));
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
        console.log('FPS: %s', this.fps);
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
BaseAvatar.prototype.velocity            = 18/1000;
BaseAvatar.prototype.defaultVelocity     = 18/1000;
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
    this.velocity = this.velocity + ((this.defaultVelocity * 33)/100);
};

/**
 * Downgrade velocity
 */
BaseAvatar.prototype.downVelocity = function()
{
    this.velocity = this.velocity - ((this.defaultVelocity * 33)/100);
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
 * BaseBonus
 *
 * @param name
 * @param color
 * @param radius
 */
function BaseBonus(name, color, radius)
{
    EventEmitter.call(this);
    this.id              = this.generateUUID();
    this.name            = name || this.defaultName;
    this.color           = color || this.defaultColor;
    this.radius          = radius || this.defaultRadius;
    this.active          = false;
    this.positive        = true;

    this.position        = [this.radius, this.radius];

    this.printing        = false;
    this.printingTimeout = null;
    this.mask            = 0;
}

BaseBonus.prototype = Object.create(EventEmitter.prototype);

BaseBonus.prototype.precision      = 1;
BaseBonus.prototype.noPrintingTime = 200;
BaseBonus.prototype.printingTime   = 3000;
BaseBonus.prototype.defaultName    = 'Bonus';
BaseBonus.prototype.defaultColor   = '#7CFC00';
BaseBonus.prototype.defaultRadius  = 1.2;

/**
 * Set Point
 *
 * @param {Array} point
 */
BaseBonus.prototype.setPosition = function(point)
{
    this.position[0] = point[0];
    this.position[1] = point[1];
};

/**
 * Get distance
 *
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Number}
 */
BaseBonus.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};

/**
 * Pop
 */
BaseBonus.prototype.pop = function() {
    this.active = true;
};

/**
 * Clear
 *
 * @param {Array} point
 */
BaseBonus.prototype.clear = function()
{
    this.active = false;
};

/**
 * Update
 */
BaseBonus.prototype.update = function() {};

/**
 * http://www.broofa.com/Tools/Math.uuid.htm
 * @returns {Function}
 */
BaseBonus.prototype.generateUUID = function () {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = new Array(36), rnd = 0, r;

    for ( var i = 0; i < 36; i ++ ) {
        if ( i == 8 || i == 13 || i == 18 || i == 23 ) {
            uuid[ i ] = '-';
        } else if ( i == 14 ) {
            uuid[ i ] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }

    return uuid.join('');
};

BaseBonus.prototype.serialize = function () {
    return {
        id: this.id,
        name: this.name,
        color: this.color,
        radius: this.radius,
        active: this.active,
        position: this.position
    };
};

BaseBonus.prototype.unserialize = function (bonus) {
    _.extend(this, bonus);
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
    this.avatars  = this.room.players.map(function () { return this.getAvatar(); });
    this.bonuses  = new Collection([], 'id');
    this.size     = this.getSize(this.avatars.count());
    this.rendered = null;
    this.maxScore = this.getMaxScore(this.avatars.count());
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
    this.points = [];
};
/**
 * Game Controller
 */
function GameController(io)
{
    this.io    = io;
    this.games = new Collection([], 'name');

    this.onDie         = this.onDie.bind(this);
    this.onAngle       = this.onAngle.bind(this);
    this.onPosition    = this.onPosition.bind(this);
    this.onPoint       = this.onPoint.bind(this);
    this.onScore       = this.onScore.bind(this);
    this.onTrailClear  = this.onTrailClear.bind(this);
    this.onRoundNew    = this.onRoundNew.bind(this);
    this.onRoundEnd    = this.onRoundEnd.bind(this);
    this.onRoundWinner = this.onRoundWinner.bind(this);
    this.onEnd         = this.onEnd.bind(this);
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
        game.on('end', this.onEnd);

        game.on('bonus:pop', this.onBonusPop);
        game.on('bonus:clear', this.onBonusClear);
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
GameController.prototype.attach = function(client, game)
{
    if (!game.clients.exists(client)) {
        client.joinGame(game);
        this.attachEvents(client);
    }
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
        for (var i = client.players.items.length - 1; i >= 0; i--) {
            this.io.sockets.in(client.room.game.channel).emit('game:leave', {avatar: client.players.items[i].avatar.name});
        }
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
    var controller = this,
        avatar;

    client.socket.on('loaded', function (data) { controller.onGameLoaded(client); });
    client.socket.on('player:move', function (data) { controller.onMove(client, data); });

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;

        avatar.on('die', this.onDie);
        avatar.on('angle', this.onAngle);
        avatar.on('position', this.onPosition);
        avatar.on('velocity:up', this.onVelocityUp);
        avatar.on('velocity:down', this.onVelocityDown);
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
    client.socket.removeAllListeners('loaded');
    client.socket.removeAllListeners('channel');
    client.socket.removeAllListeners('player:move');

    for (var i = client.players.items.length - 1; i >= 0; i--) {
        client.players.items[i].avatar.removeAllListeners('die');
        client.players.items[i].avatar.removeAllListeners('position');
        client.players.items[i].avatar.removeAllListeners('velocity:up');
        client.players.items[i].avatar.removeAllListeners('velocity:down');
        client.players.items[i].avatar.removeAllListeners('point');
        client.players.items[i].avatar.removeAllListeners('score');
        client.players.items[i].avatar.trail.removeAllListeners('clear');
    }
};

/**
 * On game loaded
 *
 * @param {SocketClient} client
 */
GameController.prototype.onGameLoaded = function(client)
{
    var avatar;

    for (var i = client.players.ids.length - 1; i >= 0; i--) {
        avatar = client.players.items[i].avatar;
        avatar.ready = true;
        this.io.sockets.in(client.room.game.channel).emit('position', {avatar: avatar.name, point: avatar.head});
        this.io.sockets.in(client.room.game.channel).emit('angle', {avatar: avatar.name, angle: avatar.angle});
    }

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
        channel = avatar.player.client.room.game.channel,
        point = data.point;

    this.io.sockets.in(channel).emit('position', {avatar: avatar.name, point: point});
};

/**
 * On angle
 *
 * @param {Object} data
 */
GameController.prototype.onAngle = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel,
        angle = data.angle;

    this.io.sockets.in(channel).emit('angle', {avatar: avatar.name, angle: angle});
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onPoint = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel,
        point = data.point;

    this.io.sockets.in(channel).emit('point', {avatar: avatar.name, point: point});
};

/**
 * On die
 *
 * @param {Object} data
 */
GameController.prototype.onDie = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel;

    this.io.sockets.in(channel).emit('die', {avatar: avatar.name});
};

/**
 *
 * @param {SocketClient} client
 */
GameController.prototype.onVelocityUp = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel;
    
    this.io.sockets.in(channel).emit('velocity:up', {avatar: avatar.name});
};

/**
 *
 * @param {SocketClient} client
 */
GameController.prototype.onVelocityDown = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel;

    this.io.sockets.in(channel).emit('velocity:down', {avatar: avatar.name});
};

/**
 * On bonus pop
 *
 * @param {SocketClient} game
 */
GameController.prototype.onBonusPop = function(data)
{
    var game = data.game,
        channel = data.game.channel;
    
    this.io.sockets.in(channel).emit('bonus:pop', data.bonus);
};

/**
 * On bonus clear
 *
 * @param {SocketClient}client
 * @param data
 */
GameController.prototype.onBonusClear = function(data)
{
    var game = data.game,
        channel = data.game.channel;

    this.io.sockets.in(channel).emit('bonus:clear', data.bonus);
};


/**
 * On score
 *
 * @param {Object} data
 */
GameController.prototype.onScore = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel,
        score = data.score;

    this.io.sockets.in(channel).emit('score', {avatar: avatar.name, score: score});
};

/**
 * On point
 *
 * @param {Object} data
 */
GameController.prototype.onTrailClear = function(data)
{
    var avatar = data.avatar,
        channel = avatar.player.client.room.game.channel;

    this.io.sockets.in(channel).emit('trail:clear', {avatar: avatar.name});
};

// Game events:

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundNew = function(data)
{
    this.io.sockets.in(data.game.channel).emit('round:new');
};

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onRoundEnd = function(data)
{
    this.io.sockets.in(data.game.channel).emit('round:end');
};

/**
 * On round winner
 *
 * @param {Object} data
 */
GameController.prototype.onRoundWinner = function(data)
{
    this.io.sockets.in(data.game.channel).emit('round:winner', {winner: data.winner.name});
};

/**
 * On round new
 *
 * @param {Object} data
 */
GameController.prototype.onEnd = function(data)
{
    this.io.sockets.in(data.game.channel).emit('end');
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

        for (var i = client.players.items.length - 1; i >= 0; i--) {
            this.io.sockets.in('rooms').emit('room:leave', {room: client.room.name, player: client.players.items[i].name});
        }

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
        player = room ? client.joinRoom(room, data.player) : null;

    callback({success: player ? true : false});

    if (player) {
        this.io.sockets.in('rooms').emit('room:join', {room: room.name, player: player.serialize()});
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
    var room = client.room,
        player = client.players.getById(data.player);

    if (room && player) {
        player.setColor(data.color);

        callback({success: true, color: player.color});

        this.io.sockets.in('rooms').emit('room:player:color', {
            room: room.name,
            player: player.name,
            color: player.color
        });
    }
};

/**
 * On new room
 *
 * @param {Object} data
 */
RoomController.prototype.onReadyRoom = function(client, data, callback)
{
    var room = client.room,
        player = client.players.getById(data.player);

    if (room && player) {
        player.toggleReady();

        callback({success: true, ready: player.ready});

        this.io.sockets.in('rooms').emit('room:player:ready', {
            room: room.name,
            player: player.name,
            ready: player.ready
        });

        if (room.isReady()) {
            this.warmupRoom(room);
        }
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

    var client;

    for (var i = room.clients.items.length - 1; i >= 0; i--) {
        client = room.clients.items[i];
        this.detachEvents(client);
        this.gameController.attach(client, room.game);
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
        if (Island.circlesTouch(this.circles[i], circle)) {
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
Island.circlesTouch = function(circleA, circleB)
{
    return Island.getDistance(circleA, circleB) < (circleA[2] + circleB[2])
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
Island.getDistance = function(from, to)
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
    this.id      = socket.id;
    this.socket  = socket;
    this.players = new Collection([], 'name');
    this.room    = null;
    this.game    = null;

    this.onChannel = this.onChannel.bind(this);

    this.socket.on('channel', this.onChannel);
    this.socket.emit('open', this.id);
}

SocketClient.prototype = Object.create(EventEmitter.prototype);

/**
 * On channel change
 *
 * @param {String} channel
 */
SocketClient.prototype.onChannel = function(channel)
{
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
    if (this.room && this.room !== room) {
        this.leaveRoom();
    }

    if (room.isNameAvailable(name)) {

        if (!this.room) {
            this.room = room;
            this.room.clients.add(this);
        }

        var player = new Player(this, name);

        this.room.addPlayer(player);
        this.players.add(player);

        return player;
    }

    return false;
};

/**
 * Leave room
 */
SocketClient.prototype.leaveRoom = function()
{
    if (this.room) {

        this.leaveGame();

        var player;

        for (var i = this.players.items.length - 1; i >= 0; i--) {
            player = this.players.items[i];
            this.room.removePlayer(player);
        }

        this.players.clear();
        this.room.clients.remove(this);
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
    if (this.game && this.game !== game) {
        this.leaveGame();
    }

    if (!this.game) {
        this.game = game;
        this.game.clients.add(this);
    }
};

/**
 * Leave room
 */
SocketClient.prototype.leaveGame = function()
{
    if (this.game) {
        var player;

        for (var i = this.players.items.length - 1; i >= 0; i--) {
            player = this.players.items[i];
            this.game.removeAvatar(player.avatar);
        }

        this.game.clients.remove(this);
        this.game = null;
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
    this.emit('position', {avatar: this, point: point});
};

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setAngle = function(angle)
{
    BaseAvatar.prototype.setAngle.call(this, angle);
    this.emit('angle', {avatar: this, angle: angle});
};

/**
 * Add point
 *
 * @param {Array} point
 */
Avatar.prototype.addPoint = function(point)
{
    BaseAvatar.prototype.addPoint.call(this, point);
    this.emit('point', {avatar: this, point: point});
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
    this.emit('velocity:up');
};

/**
 * Downgrade velocity
 */
Avatar.prototype.downVelocity = function()
{
    BaseAvatar.prototype.downVelocity.call(this);
    this.emit('velocity:down');
};
/**
 * Bonus
 *
 * @param name
 * @param color
 * @param radius
 */
function Bonus(name, color, radius)
{
    BaseBonus.call(this, name, color, radius);
}

Bonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Set position
 *
 * @param {Array} point
 */
Bonus.prototype.setPosition = function(point)
{
    BaseBonus.prototype.setPosition.call(this, point);
    this.emit('bonus:position', point);
};

/**
 * Pop
 */
Bonus.prototype.pop = function()
{
    BaseBonus.prototype.pop.call(this);
    this.emit('bonus:pop', this.position);
};

/**
 * Clear
 */
Bonus.prototype.clear = function()
{
    BaseBonus.prototype.clear.call(this);
    this.emit('clear');
};

Bonus.prototype.isTakenBy = function (avatar) {
    if (
        this.active &&
        Island.circlesTouch(
            [avatar.head[0], avatar.head[1], avatar.radius, avatar.mask],
            [this.position[0], this.position[1], this.radius, 0]
        )
    ) {
        return true;
    } else {
        return false;
    }
};

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
    this.deaths  = [];
    this.clients = new Collection();

    this.addPoint             = this.addPoint.bind(this);
    this.onDie                = this.onDie.bind(this);
    this.bonusPrinting        = false;
    this.bonusPrintingTimeout = null;

    this.toggleBonusPrinting = this.toggleBonusPrinting.bind(this);

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].on('point', this.addPoint);
        this.avatars.items[i].on('die', this.onDie);
        this.avatars.items[i].setMask(i+1);
    }
}

Game.prototype = Object.create(BaseGame.prototype);

Game.prototype.bonusCap            = 20;
Game.prototype.bonusPoppingRate    = 0.2;
Game.prototype.noBonusPrintingTime = 200;
Game.prototype.bonusPrintingTime   = 3000;

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

    var avatar, bonus;

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        if (avatar.alive && !this.world.testCircle(avatar.update(step))) {
            avatar.die();
        }

        if (this.bonusPrinting) {
            this.popBonus();
        }

        // check if a bonus has been taken
        for (var i = this.bonuses.ids.length - 1; i >= 0; i--) {
            bonus = this.bonuses.items[i];

            if (bonus.isTakenBy(avatar)) {
                // sample speed bonus test
                bonus.clear();
                this.emit('bonus:clear', { game: this, bonus: bonus.serialize() });
                avatar.upVelocity();
                setTimeout(function() { avatar.downVelocity() }, 3333);
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
            var winner = this.avatars.match(function () { return this.alive; });

            winner.addScore(total);
            this.emit('round:winner', {game: this, winner: winner});
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

    this.stopBonusPrinting();

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
        var avatar, bonus, position;

        this.emit('round:new', {game: this});

        this.world.clear();

        this.inRound = true;
        this.deaths  = [];

        for (var i = this.avatars.items.length - 1; i >= 0; i--) {
            avatar = this.avatars.items[i];

            avatar.clear();
            avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
            avatar.setAngle(Math.random() * Math.PI * 2);
        }

        for (var i = this.bonuses.ids.length - 1; i >= 0; i--) {
            bonus = this.bonuses.items[i];
            bonus.clear();
            this.emit('bonus:clear', bonus.serialize());
            this.bonuses.removeById(bonus.id);
        }

        BaseGame.prototype.newRound.call(this);
    }
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

    // toggle bonuses printing
    setTimeout(this.toggleBonusPrinting, 3000);

    BaseGame.prototype.start.call(this);
};

/**
 *
 */
Game.prototype.toggleBonusPrinting = function () {
    this.bonusPrinting = !this.bonusPrinting;

    clearTimeout(this.bonusPrintingTimeout);
    this.printingTimeout = setTimeout(this.toggleBonusPrinting, this.getRandomPrintingTime());
}

/**
 * Stop printing
 */
Game.prototype.stopBonusPrinting = function()
{
    clearTimeout(this.printingTimeout);

    this.printing = false;
};

/**
 *
 */
Game.prototype.popBonus = function () {
    if (this.bonuses.count() < this.bonusCap) {

        if (this.chancePercent(this.bonusPoppingRate)) {
            var bonus = new Bonus('test', '#7CFC00');
            bonus.setPosition(this.world.getRandomPosition(bonus.radius, 0.1));
            bonus.pop();
            this.emit('bonus:pop', { game: this, bonus: bonus.serialize() });
            this.bonuses.add(bonus);
        }
    }
}

/**
 *
 * @param percentTrue
 * @returns {boolean}
 */
Game.prototype.chancePercent = function (percentTrue) {
    percentTrue = percentTrue || 100;
    if(Math.floor(Math.random()*101) <= percentTrue) {
        return true;
    }
    return false;
}

/**
 * Get random printing time
 *
 * @return {Number}
 */
Game.prototype.getRandomPrintingTime = function()
{
    if (this.bonusPrinting) {
        return this.bonusPrintingTime * (0.2 + Math.random() * 0.8);
    } else {
        return this.noBonusPrintingTime * (0.8 + Math.random() * 0.5);
    }
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    this.world.clear();

    this.emit('end', {game: this});

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
    BasePlayer.call(this, client, name, color, mail);
}
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