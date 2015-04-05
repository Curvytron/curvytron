/**
 * Die message
 *
 * @param {Player} curvyBot
 * @param {Player} deadPlayer
 * @param {Player} killerPlayer
 */
function DieMessage (curvyBot, deadPlayer, killerPlayer, old)
{
    Message.call(this, null, null, curvyBot);

    this.deadPlayer   = deadPlayer;
    this.killerPlayer = killerPlayer;
    this.old          = old;
    this.deathType    = this.resolveDeathType();
}

DieMessage.prototype = Object.create(Message.prototype);
DieMessage.prototype.constructor = DieMessage;

/**
 * Message type
 *
 * @type {String}
 */
DieMessage.prototype.type = 'die';

/**
 * Resolve death type
 *
 * @return {String}
 */
DieMessage.prototype.resolveDeathType = function()
{
    if (!this.killerPlayer) {
        return 'wall';
    }

    if (this.deadPlayer.equal(this.killerPlayer)) {
        return 'suicide';
    }

    return this.old ? 'crash' : 'kill';
};
