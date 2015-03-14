/**
 * Message
 *
 * @param {String} content
 * @param {SocketClient} client
 * @param {Player} player
 * @param {Number} creation
 */
function Message (content, client, player, creation)
{
    BaseMessage.call(this, content);

    this.client   = client;
    this.player   = player;

    if (typeof(creation) === 'number') {
        this.creation = new Date(creation);
    }
}

Message.prototype = Object.create(BaseMessage.prototype);
Message.prototype.constructor = Message;

/**
 * Message type
 *
 * @type {String}
 */
Message.prototype.type = 'default';

/**
 * Default color
 *
 * @type {String}
 */
Message.prototype.defaultColor = '#75858c';

/**
 * Default name
 *
 * @type {String}
 */
Message.prototype.defaultName = 'Anonymous';

/**
 * Get player name
 *
 * @return {String}
 */
Message.prototype.getPlayerName = function()
{
    return this.player ? this.player.name : this.defaultName;
};

/**
 * Get player icon
 *
 * @return {String}
 */
Message.prototype.getPlayerIcon = function()
{
    return this.player && typeof(this.player.icon) !== 'undefined' ? this.player.icon : null;
};

/**
 * Get player color
 *
 * @return {String}
 */
Message.prototype.getPlayerColor = function()
{
    return this.player ? this.player.color : this.defaultColor;
};

/**
 * Serialize
 *
 * @return {Object}
 */
Message.prototype.serialize = function()
{
    return {content: this.content};
};

/**
 * Get date to text
 *
 * @return {String}
 */
Message.prototype.getDate = function()
{
    if (!this.creation) {
        return null;
    }

    return  this.creation.getHours() + ':' + this.creation.getMinutes();
};
