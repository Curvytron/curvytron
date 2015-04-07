/**
 * Kick message
 *
 * @param {Object} author
 * @param {Player} target
 */
function RoomMasterMessage (player, client)
{
    Message.call(this, null, client, player);

    this.target = this.client.players.getFirst();
}

RoomMasterMessage.prototype = Object.create(Message.prototype);
RoomMasterMessage.prototype.constructor = RoomMasterMessage;

/**
 * Message type
 *
 * @type {String}
 */
RoomMasterMessage.prototype.type = 'room-master';

/**
 * Get target
 *
 * @return {Player}
 */
RoomMasterMessage.prototype.getTarget = function()
{
    if (this.client.players.getFirst()) {
        return this.client.players.getFirst();
    }

    return this.target;
};
