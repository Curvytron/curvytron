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
    return typeof(this.player.name) === 'string' ? this.player.name : this.defaultName;
};

/**
 * Get player icon
 *
 * @return {String}
 */
Message.prototype.getPlayerIcon = function()
{
    return typeof(this.player.icon) !== 'undefined' ? this.player.icon : null;
};

/**
 * Get player color
 *
 * @return {String}
 */
Message.prototype.getPlayerColor = function()
{
    return typeof(this.player.color) === 'string' ? this.player.color : this.defaultColor;
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

    var hours = this.creation.getHours().toString(),
        minutes = this.creation.getMinutes().toString();

    if (hours.length === 1) {
        hours = '0' + hours;
    }

    if (minutes.length === 1) {
        minutes = '0' + minutes;
    }

    return hours + ':' + minutes;
};
