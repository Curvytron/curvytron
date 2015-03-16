/**
 * Chat flood filter
 *
 * @param {Array} messages
 */
function FloodFilter(messages)
{
    this.messages = messages;
}

/**
 * Number of message allowed
 *
 * @type {Number}
 */
FloodFilter.prototype.toleranceTotal = 3;

/**
 * Range of time for tolerance
 *
 * @type {Number}
 */
FloodFilter.prototype.toleranceRange = 2000;

/**
 * Is message valid?
 *
 * @param {Message} message
 *
 * @return {Boolean}
 */
FloodFilter.prototype.isValid = function(message)
{
    var history = this.getClientHistory(message.client.id, new Date().getTime() - this.toleranceRange);

    return history < this.toleranceTotal;
};

/**
 * Get client history
 *
 * @param {Number} id
 * @param {Date} maxDate
 *
 * @return {[type]}
 */
FloodFilter.prototype.getClientHistory = function(id, max)
{
    var history = 0,
        message;

    for (var i = this.messages.length - 1; i >= 0; i--) {
        message = this.messages[i];

        if (message.client.id === id) {
            history++;
        }

        if (message.creation < max) {
            break;
        }
    }

    return history;
};
