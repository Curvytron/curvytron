/**
 * Kick message
 *
 * @param {Player} player
 * @param {Player} target
 */
function KickMessage (player, target)
{
    BaseMessage.call(this, null, null, player);

    this.target = target;
}

KickMessage.prototype = Object.create(BaseMessage.prototype);
KickMessage.prototype.constructor = KickMessage;

/**
 * Message type
 *
 * @type {String}
 */
KickMessage.prototype.type = 'kick';
