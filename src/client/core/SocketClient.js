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
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onSocketConnection = function(data)
{
    console.log('Connected', data);
    console.log(this.io);

    //this.attachEvents();
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