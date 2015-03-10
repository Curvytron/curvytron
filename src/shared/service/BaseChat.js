/**
 * BaseChat system
 */
function BaseChat()
{
    EventEmitter.call(this);

    this.messages = [];
}

BaseChat.prototype = Object.create(EventEmitter.prototype);
BaseChat.prototype.constructor = BaseChat;

/**
 * Add message
 *
 * @param {Message} message
 */
BaseChat.prototype.addMessage = function(message)
{
    if (message.content.length === 0) {
        return false;
    }

    this.messages.push(message);
    this.emit('message', message);

    return true;
};

/**
 * Clear
 */
BaseChat.prototype.clear = function()
{
    this.messages.length = 0;
};

/**
 * Serialize
 *
 * @return {Array}
 */
BaseChat.prototype.serialize = function(max)
{
    var length = typeof(max) === 'number' ? Math.min(max, this.messages.length) : this.messages.length,
        messages = new Array(length);

    for (var i = length - 1; i >= 0; i--) {
        messages[i] = this.messages[i].serialize();
    }

    return messages;
};
