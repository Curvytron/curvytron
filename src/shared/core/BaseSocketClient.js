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

    this.flush     = this.flush.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose   = this.onClose.bind(this);
    this.ping      = this.onPing.bind(this);

    this.attachEvents();
    this.start();
}

BaseSocketClient.prototype = Object.create(EventEmitter.prototype);
BaseSocketClient.prototype.constructor = BaseSocketClient;

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
 * On socket close
 */
BaseSocketClient.prototype.onClose = function()
{
    this.emit('close', this);
    this.stop();
    this.detachEvents();
};


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
    this.socket.onmessage = this.onMessage;
    this.socket.onclose   = this.onClose;

    this.on('ping', this.onPing);
};

/**
 * Detach Events
 */
BaseSocketClient.prototype.detachEvents = function()
{
    this.socket.removeEventListener('mesage', this.onMessage);
    this.socket.removeEventListener('close', this.onClose);

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
        event[2] = new Date().getTime();
        this.callbacks[event[2]] = callback;
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
        events = [],
        event;

    for (var i = 0; i < length; i++) {
        event = [this.eventPrefix + sources[i][0]];

        if (typeof(sources[i][1]) !== 'undefined') {
            event[1] = sources[i][1];
        }

        if (typeof(sources[i][2]) !== 'undefined') {
            event[2] = new Date().getTime();
            this.callbacks[event[2]] = sources[i][2];
        }

        events.push(event);
    }

    if (!this.interval || force) {
        this.sendEvents(events);
    } else {
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
    } else {
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
 * @param {Event} e
 */
BaseSocketClient.prototype.onMessage = function (e)
{
    var data = JSON.parse(e.data),
        length = data.length,
        name,
        isEvent;

    for (var i = 0; i < length; i++) {

        isEvent = data[i][0].substr(0, this.eventPrefix.length) === this.eventPrefix;
        name = data[i][0].substr(this.eventPrefix.length);

        if (isEvent) {
            if (typeof(data[i][2]) === 'number') {
                this.emit(name, {data: data[i][1], callback: this.createCallback(data[i][2])});
            } else {
                this.emit(name, data[i][1]);
            }
        } else {
            id = parseInt(name, 10);

            if(typeof(this.callbacks[id]) !== 'undefined') {
                this.callbacks[id](typeof(data[i][1]) !== 'undefined' ? data[i][1] : null);
                delete this.callbacks[id];
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
