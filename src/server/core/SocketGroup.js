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