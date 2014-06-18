/**
 * SocketClient
 */
function SocketClient()
{
    this.io        = io();
    this.connected = false;

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.io.on('open', this.onSocketConnection);
    this.io.on('close', this.onSocketDisconnection);
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
    this.connected = true;
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onSocketDisconnection = function(e)
{
    console.log('Disconnect', e);
    this.connected = false;
};