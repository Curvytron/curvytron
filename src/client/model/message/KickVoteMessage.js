/**
 * New Kick vote message
 *
 * @param {Player} player
 * @param {Player} target
 */
function VoteKickMessage (player, target)
{
    BaseMessage.call(this, player);

    this.target = target;
}

VoteKickMessage.prototype = Object.create(BaseMessage.prototype);
VoteKickMessage.prototype.constructor = VoteKickMessage;

/**
 * Message type
 *
 * @type {String}
 */
VoteKickMessage.prototype.type = 'vote-kick';
