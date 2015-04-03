/**
 * Die message
 *
 * @param {Player} curvyBot
 * @param {Player} deadPlayer
 * @param {Player} killerPlayer
 */
function DieMessage (curvyBot, deadPlayer, killerPlayer)
{
    Message.call(this, null, null, curvyBot);

    this.deadPlayer   = deadPlayer;
    this.killerPlayer = killerPlayer;
}

DieMessage.prototype = Object.create(Message.prototype);
DieMessage.prototype.constructor = DieMessage;

/**
 * Message type
 *
 * @type {String}
 */
DieMessage.prototype.type = 'die';
