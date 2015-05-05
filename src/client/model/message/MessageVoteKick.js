/**
 * New Kick vote message
 *
 * @param {Player} target
 */
function MessageVoteKick(target)
{
    Message.call(this);

    this.target = target;
}

MessageVoteKick.prototype = Object.create(Message.prototype);
MessageVoteKick.prototype.constructor = MessageVoteKick;

/**
 * Message type
 *
 * @type {String}
 */
MessageVoteKick.prototype.type = 'vote-kick';

/**
 * Default icon
 *
 * @type {String}
 */
MessageVoteKick.prototype.icon = 'icon-megaphone';
