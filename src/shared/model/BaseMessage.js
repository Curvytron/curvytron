/**
 * Base Message
 *
 * @param {String} content
 * @param {SocketClient} client
 */
function BaseMessage(content)
{
    this.content  = content;
    this.creation = new Date();
}

/**
 * Message max length
 *
 * @type {Number}
 */
BaseMessage.prototype.maxLength = 140;

/**
 * Clear message
 */
BaseMessage.prototype.clear = function()
{
    this.content = '';
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseMessage.prototype.serialize = function()
{
    return {
        content: this.content,
        creation: this.creation.getTime(),
    };
};
