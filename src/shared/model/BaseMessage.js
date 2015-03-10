/**
 * Base Message
 *
 * @param {String} content
 * @param {SocketClient} client
 * @param {Player} player
 */
function BaseMessage (content, client, player)
{
    this.content = typeof(content) !== 'undefined' ? content : '';
    this.client  = typeof(client) !== 'undefined' ? client : null;
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
 * Get player icon
 *
 * @return {String}
 */
BaseMessage.prototype.getPlayerIcon = function()
{
    return this.player && typeof(this.player.icon) !== 'undefined' ? this.player.icon : null;
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
        client: this.client ? this.client.id : null,
        player: this.player ? this.player.id : null
    };
};
