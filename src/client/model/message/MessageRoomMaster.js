/**
 * Room master message
 *
 * @param {SocketClient} client
 */
function MessageRoomMaster(client)
{
    Message.call(this);

    this.client = client;
    this.target = this.getPlayer();
}

MessageRoomMaster.prototype = Object.create(Message.prototype);
MessageRoomMaster.prototype.constructor = MessageRoomMaster;

/**
 * Message type
 *
 * @type {String}
 */
MessageRoomMaster.prototype.type = 'room-master';

/**
 * Default icon
 *
 * @type {String}
 */
MessageRoomMaster.prototype.icon = 'icon-megaphone';

/**
 * Get target
 *
 * @return {Player}
 */
MessageRoomMaster.prototype.getTarget = function()
{
    var player = this.getPlayer();

    return player ? player : this.target;
};

/**
 * Get player
 *
 * @return {Player}
 */
MessageRoomMaster.prototype.getPlayer = function()
{
    return this.client.players.getFirst();
};
