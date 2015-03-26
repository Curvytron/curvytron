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
    if (!this.isValid(message)) {
        return false;
    }

    this.messages.push(message);
    this.emit('message', message);

    return true;
};

/**
 * Is message valid?
 *
 * @param {Message} message
 *
 * @return {Boolean}
 */
BaseChat.prototype.isValid = function(message)
{
    return true;
};

/**
 * Clear messages
 */
BaseChat.prototype.clearMessages = function()
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
    var length = this.messages.length,
        limit = typeof(max) === 'number' ? Math.min(max, length) : length,
        min = length - limit,
        messages = new Array(length);

    for (var i = length - 1; i >= min; i--) {
        messages[i] = this.messages[i].serialize();
    }

    return messages;
};
