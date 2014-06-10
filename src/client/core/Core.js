/**
 * Core
 *
 * @param {Object} config
 */
function Core(config)
{
    this.io = io();

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.socket.on('open', this.onSocketConnection);
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Core.prototype.onSocketConnection = function(data)
{
    console.log('Connected', data);

    this.attachEvents();
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Core.prototype.onSocketDisconnection = function(e)
{
    console.log('Disconnect', e);
};