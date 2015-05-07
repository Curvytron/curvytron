/**
 * Base Socket Client
 *
 * @param {Object} socket
 * @param {Number} interval
 */
function BaseSocketClient(socket, interval)
{
    EventEmitter.call(this);

    this.socket    = socket;
    this.interval  = typeof(interval) === 'number' ? interval : 0;
    this.events    = [];
    this.callbacks = {};
    this.loop      = null;
    this.connected = true;
    this.callCount = 0;

    this.flush     = this.flush.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose   = this.onClose.bind(this);

    this.attachEvents();
    this.start();
}

BaseSocketClient.prototype = Object.create(EventEmitter.prototype);
BaseSocketClient.prototype.constructor = BaseSocketClient;

/**
 * On socket close
 */
BaseSocketClient.prototype.onClose = function()
{
    this.connected = false;
    this.emit('close', this);
    this.stop();
    this.detachEvents();
};


/**
 * Set interval
 *
 * @param {Number} interval
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
    this.socket.addEventListener('message', this.onMessage);
    this.socket.addEventListener('close', this.onClose);
};

/**
 * Detach Events
 */
BaseSocketClient.prototype.detachEvents = function()
{
    this.socket.removeEventListener('message', this.onMessage);
    this.socket.removeEventListener('close', this.onClose);
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
    var event = [name];

    if (typeof(data) !== 'undefined') {
        event[1] = data;
    }

    if (typeof(callback) === 'function') {
        event[2] = this.indexCallback(callback);
    }

    if (!this.interval || (typeof(force) !== 'undefined' && force)) {
        this.sendEvents([event]);
    } else {
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
        events = [];

    for (var i = 0; i < length; i++) {
        events.push(sources[i]);
    }

    if (!this.interval || force) {
        this.sendEvents(events);
    } else {
        Array.prototype.push.apply(this.events, events);
        this.start();
    }
};

/**
 * Index a new callback
 *
 * @param {Function} callback
 *
 * @return {Number}
 */
BaseSocketClient.prototype.indexCallback = function(callback)
{
    var index = this.callCount++;

    this.callbacks[index] = callback;

    return index;
};

/**
 * Add a callback
 *
 * @param {Number} id
 * @param {Object} data
 */
BaseSocketClient.prototype.addCallback = function (id, data)
{
    var event = [id];

    if (typeof(data) !== 'undefined') {
        event[1] = data;
    }

    this.sendEvents([event]);
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
        this.events.length = 0;
    }
};

/**
 * On message
 *
 * @param {Event} e
 */
BaseSocketClient.prototype.onMessage = function (e)
{
    var data = JSON.parse(e.data),
        length = data.length,
        name, source;

    for (var i = 0; i < length; i++) {
        source = data[i];
        name = source[0];

        if (typeof(name) === 'string') {
            if (source.length === 3) {
                this.emit(name, [source[1], this.createCallback(source[2])]);
            } else {
                this.emit(name, source[1]);
            }
        } else {
            this.playCallback(name, typeof(source[1]) !== 'undefined' ? source[1] : null);
        }
    }
};

/**
 * Play an indexed callback
 *
 * @param {Number} id
 * @param {Object|null} data
 */
BaseSocketClient.prototype.playCallback = function(id, data)
{
    if (typeof(this.callbacks[id]) !== 'undefined') {
        this.callbacks[id](data);
        delete this.callbacks[id];
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
 * Object version of the client
 *
 * @return {Object}
 */
BaseSocketClient.prototype.serialize = function()
{
    return {id: this.id};
};
