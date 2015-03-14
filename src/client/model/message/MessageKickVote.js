/**
 * New Kick vote message
 *
 * @param {Player} player
 * @param {Player} target
 */
function VoteKickMessage(player, target)
{
    Message.call(this, null, null, player);

    this.target = target;
}

VoteKickMessage.prototype = Object.create(Message.prototype);
VoteKickMessage.prototype.constructor = VoteKickMessage;

/**
 * Message type
 *
 * @type {String}
 */
VoteKickMessage.prototype.type = 'vote-kick';
