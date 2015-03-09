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
    this.messages[] = message;

    this.emit('message', message);
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
BaseChat.prototype.serialize = function()
{
    var messages = [],
        length = this.messages.length;

    for (var i = 0; i < length; i++) {
        messages.push(this.messages[i].serialize());
    }

    return messages;
};
