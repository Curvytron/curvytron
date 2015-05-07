/**
 * Chat system
 */
function Chat()
{
    BaseChat.call(this);

    this.floodFilter = new FloodFilter(this.messages);
}

Chat.prototype = Object.create(BaseChat.prototype);
Chat.prototype.constructor = Chat;

/**
 * Is message valid?
 *
 * @param {Message} message
 *
 * @return {Boolean}
 */
Chat.prototype.isValid = function(message)
{
    var length = message.content.length;

    return length > 0 && length <= Message.prototype.maxLength && this.floodFilter.isValid(message);
};
