/**
 * SocketClient
 */
function SocketClient()
{
    this.io        = io();
    this.connected = false;
    this.id        = null;

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.io.on('open', this.onSocketConnection);
    this.io.on('close', this.onSocketDisconnection);
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onSocketConnection = function(id)
{
    console.log('Connected');
    this.connected = true;
    this.id        = id;
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