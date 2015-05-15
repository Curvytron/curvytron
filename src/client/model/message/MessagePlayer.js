/**
 * Player Message
 *
 * @param {SocketClient} client
 * @param {String} content
 * @param {Player} player
 * @param {Number} creation
 */
function MessagePlayer(client, content, player, creation)
{
    Message.call(this, creation);

    this.client  = client;
    this.content = content;
    this.player  = player;
}

MessagePlayer.prototype = Object.create(Message.prototype);
MessagePlayer.prototype.constructor = MessagePlayer;

/**
 * Message type
 *
 * @type {String}
 */
MessagePlayer.prototype.type = 'player';

/**
 * Clear message
 */
MessagePlayer.prototype.clear = function()
{
    this.content = '';
};

