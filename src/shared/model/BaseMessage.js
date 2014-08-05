/**
 * Base Message
 *
 * @param {Player} player
 * @param {String} content
 */
function BaseMessage (player, content)
{
    this.content = typeof(content) !== 'undefined' ? content : '';
    this.player  = typeof(player) !== 'undefined' ? player : null;
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
 * Get player name
 *
 * @return {String}
 */
BaseMessage.prototype.getPlayerName = function()
{
    return this.player ? this.player.name : 'Anonymous';
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseMessage.prototype.serialize = function()
{
    return {
        content: this.content.substr(0, this.maxLength),
        player: this.player ? this.player.id : null
    };
};