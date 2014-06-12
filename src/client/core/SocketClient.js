/**
 * SocketClient
 */
function SocketClient()
{
    this.io = io();

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.io.on('open', this.onSocketConnection);
}

/**
 * Join a channel
 *
 * @param {String} channel
 */
SocketClient.prototype.join = function(channel)
{
    console.log("Joinning channel %s", channel);
    this.io.emit('channel', channel);
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onSocketConnection = function()
{
    console.log('Connected');
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onSocketDisconnection = function(e)
{
    console.log('Disconnect', e);
};