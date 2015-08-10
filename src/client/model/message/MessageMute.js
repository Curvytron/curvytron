/**
 * Mute message
 *
 * @param {Number} client
 * @param {Player} player
 */
function MessageMute(client, player)
{
    Message.call(this);

    this.client = client;
    this.player = player;
}

MessageMute.prototype = Object.create(Message.prototype);
MessageMute.prototype.constructor = MessageMute;

/**
 * Message type
 *
 * @type {String}
 */
MessageMute.prototype.type = 'mute';

/**
 * Default icon
 *
 * @type {String}
 */
MessageMute.prototype.icon = 'icon-megaphone';
