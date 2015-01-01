/**
 * Message
 *
 * @param {Player} player
 * @param {String} content
 */
function Message (player, content)
{
    BaseMessage.call(this, player, content);
}

Message.prototype = Object.create(BaseMessage.prototype);
Message.prototype.constructor = Message;

/**
 * Message type
 *
 * @type {String}
 */
Message.prototype.type = 'default';
