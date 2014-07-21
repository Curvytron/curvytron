/**
 * Socket group
 *
 * @param {Object} clients
 */
function SocketGroup(clients)
{
    this.clients = typeof(clients) !== 'undefined' ? clients : new Collection();
}

/**
 * Add a listener
 *
 * @param {String} name
 * @param {Function} callback
 */
SocketGroup.prototype.on = function(name, callback)
{
    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.clients.items[i].on(name, callback);
    }
};

/**
 * Remove a listener
 *
 * @param {String} name
 * @param {Function} callback
 */
SocketGroup.prototype.removeListener = function(name, callback)
{
    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.clients.items[i].removeListener(name, callback);
    }
};

/**
 * Add a group of events event to the list
 *
 * @param {Array} events
 * @param {Boolean} force
 */
SocketGroup.prototype.addEvents = function(events, force)
{
    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.clients.items[i].addEvents(events, force);
    }
};

/**
 * Add an event to the list
 *
 * @param {String} name
 * @param {Object} data
 * @param {Function} callback
 * @param {Boolean} force
 */
SocketGroup.prototype.addEvent = function(name, data, callback, force)
{
    for (var i = this.clients.items.length - 1; i >= 0; i--) {
        this.clients.items[i].addEvent(name, data, callback, force);
    }
};