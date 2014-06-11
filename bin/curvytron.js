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
 * Base Avatar
 *
 * @param {Player} name
 * @param {String} color
 */
function BaseAvatar(player)
{
    EventEmitter.call(this);

    this.player = player;
    this.trail  = new Trail(this.player.color);
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);

/**
 * Update
 */
BaseAvatar.prototype.update = function()
{
    this.trail.update();
};
/**
 * BaseGame
 */
function BaseGame(room)
{
    this.room    = room;
    this.frame   = null;
    this.avatars = this.room.players.map(function () { new Avatar(this); });
}

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step)
{
    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].update(step);
    }
};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
BaseGame.prototype.removeAvatar = function(avatar)
{
    return this.avatars.remove(avatar);
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
 * BasePlayer
 *
 * @param {String} name
 * @param {String} color
 */
function BasePlayer(name, color, mail)
{
    EventEmitter.call(this);

    this.name   = name;
    this.color  = typeof(color) !== 'undefined' ? color : 'red';
    this.mail   = mail;
    this.ready  = false;
}

BasePlayer.prototype = Object.create(EventEmitter.prototype);

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
 * Base Room
 */
function BaseRoom(name)
{
    this.name    = name;
    this.players = new Collection([], 'name');
}

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
    return this.players.filter(function () { return !this.ready; }).isEmpty();
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
 * Room Controller
 */
function RoomController(socket, repository)
{
    this.socket     = socket;
    this.repository = repository;
}

/**
 * Create a room
 *
 * @param {String} name
 *
 * @return {Room}
 */
RoomController.prototype.create = function(name)
{
    var room = this.repository.create(name);

    if (room) {
        this.emitNewRoom(room);
    }
}

/**
 * List rooms
 */
RoomController.prototype.listRooms = function(client)
{
    for (var i = this.repository.rooms.ids.length - 1; i >= 0; i--) {
        this.emitNewRoom(this.repository.rooms.items[i], client);
    }
};

/**
 * emitNewRoom
 *
 * @param {Room} room
 * @param {Socket} client
 */
RoomController.prototype.emitNewRoom = function(room, client)
{
    var socket = (typeof(client) !== 'undefined' ? client : this.socket)

    socket.emit('room:new', room.serialize());
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
    this.clients      = new Collection();

    this.repositories = {
        room: new RoomRepository()
    };

    this.controllers = {
        room: new RoomController(this.io, this.repositories.room)
    };

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.io.on('connection', this.onSocketConnection);
    this.app.use(express.static('web'));

    this.server.listen(config.port, function() {
      console.log('listening on *:' + config.port);
    });

    SocketClient.prototype.repositories = this.repositories;
    SocketClient.prototype.controllers  = this.controllers;
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketConnection = function(socket)
{
    console.log('Client connected', socket.id);

    socket.on('disconnect', this.onSocketDisconnection);

    this.clients.add(new SocketClient(socket));
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketDisconnection = function(socket)
{
    console.log('Client disconnect');

    var client = this.clients.getById(socket.id);

    if (client) {
        client.detachEvents();
        this.clients.remove(client);
    }
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

    this.onJoinRoom   = this.onJoinRoom.bind(this);
    this.onCreateRoom = this.onCreateRoom.bind(this);
    this.onReadyRoom  = this.onReadyRoom.bind(this);
    this.onColorRoom  = this.onColorRoom.bind(this);

    this.attachEvents();

    this.socket.emit('open');

    this.controllers.room.listRooms(this.socket);
}

/**
 * Attach events
 */
SocketClient.prototype.attachEvents = function()
{
    this.socket.on('room:create', this.onCreateRoom);
    this.socket.on('room:join', this.onJoinRoom);
    this.socket.on('room:ready', this.onReadyRoom);
    this.socket.on('room:color', this.onColorRoom);
};

/**
 * Attach events
 */
SocketClient.prototype.detachEvents = function()
{
    this.socket.off('room:create', this.onCreateRoom);
    this.socket.off('room:join', this.onJoinRoom);
    this.socket.off('room:ready', this.onReadyRoom);
    this.socket.off('room:color', this.onColorRoom);
};

/**
 * Broacast to room
 *
 * @param {String} event
 * @param {Object} data
 */
SocketClient.prototype.broadcastRoom = function(event, data)
{
    if (typeof(data.player) === 'undefined') {
        data.player = this.player.name;
    }

    if (typeof(data.room) === 'undefined') {
        data.room = this.room.name;
    }

    this.socket.emit(event, data);
    this.socket.broadcast.emit(event, data);
};

/**
 * On new room
 *
 * @param {String} name
 * @param {Function} callback
 */
SocketClient.prototype.onCreateRoom = function(data, callback)
{
    callback(this.controllers.room.create(data.name));
};

/**
 * On join room
 *
 * @param {Object} data
 * @param {Function} callback
 */
SocketClient.prototype.onJoinRoom = function(data, callback)
{
    var room = this.repositories.room.get(data.room),
        result = false;

    if (room) {
        if (this.room) {
            this.socket.leave(this.room.name);
            this.room.removePlayer(this.player);
        }

        this.room = room;
        this.socket.join(this.room.name);

        this.player.name  = data.player;
        this.player.ready = false;

        result = room.addPlayer(this.player);
    }

    callback({result: result, name: this.player.name});

    if (result) {
        this.broadcastRoom('room:join', {player: this.player.serialize()});
    }
};

/**
 * On new room
 *
 * @param {Object} data
 */
SocketClient.prototype.onReadyRoom = function(data, callback)
{
    this.player.ready = !this.player.ready;

    callback({success: true, ready: this.player.ready});

    this.broadcastRoom('room:player:update', {ready: this.player.ready});

    //this.room.checkReady();
};

/**
 * On new room
 *
 * @param {Object} data
 */
SocketClient.prototype.onColorRoom = function(data, callback)
{
    this.player.color = data.color;

    callback({success: true, color: this.player.color});

    this.broadcastRoom('room:player:update', {color: this.player.color});
};
/**
 * Game
 */
function Game()
{
    BaseGame.call(this);

    this.loop = this.loop.bind(this);
}

Game.prototype = Object.create(BaseGame.prototype);
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

Player.prototype = Object.create(BasePlayer.prototype);
/**
 * Room
 */
function Room(name, client)
{
    BaseRoom.call(this, name);
}

Room.prototype = Object.create(BaseRoom.prototype);

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
 * Trail
 */
function Trail(color)
{
    BaseTrail.call(this, color);
}

Trail.prototype = Object.create(BaseTrail.prototype);
/**
 * Room Repository
 */
function RoomRepository()
{
    this.rooms = new Collection([], 'name');
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