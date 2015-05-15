/**
 * Kick message
 *
 * @param {Player} target
 */
function MessageKick (target)
{
    Message.call(this);

    this.target = target;
}

MessageKick.prototype = Object.create(Message.prototype);
MessageKick.prototype.constructor = MessageKick;

/**
 * Message type
 *
 * @type {String}
 */
MessageKick.prototype.type = 'kick';

/**
 * Default icon
 *
 * @type {String}
 */
MessageKick.prototype.icon = 'icon-megaphone';
