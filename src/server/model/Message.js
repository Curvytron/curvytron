/**
 * Message
 *
 * @param {String} content
 * @param {SocketClient} client
 * @param {Player} player
 */
function Message (content, client, player)
{
    BaseMessage.call(this, content, client, player);
}

Message.prototype = Object.create(BaseMessage.prototype);
Message.prototype.constructor = Message;
