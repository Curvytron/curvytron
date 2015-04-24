/**
 * Kill log
 */
function KillLog()
{
    EventEmitter.call(this);

    this.logs = [];
}

KillLog.prototype = Object.create(EventEmitter.prototype);
KillLog.prototype.constructor = KillLog;

/**
 * Message display duration
 *
 * @type {Number}
 */
KillLog.prototype.display = 5000;

/**
 * Load the death of a player's avatar
 *
 * @param {Avatar} avatar
 * @param {Avatar|null} killer
 * @param {Boolean} old
 */
KillLog.prototype.logDeath = function(avatar, killer, old)
{
    this.add(new MessageDie(avatar, killer, old));
};

/**
 * Kill log
 *
 * @param {MessageDie} message
 */
KillLog.prototype.add = function(message)
{
    var killLog = this;

    this.logs.push(message);
    this.emit('change');

    setTimeout(function () { killLog.remove(message); }, this.display);
};

/**
 * Remove message
 *
 * @param {MessageDie} message
 */
KillLog.prototype.remove = function (message)
{
    var index = this.logs.indexOf(message);

    if (index >= 0) {
        this.logs.splice(index, 1);
        this.emit('change');
    }
};

/**
 * Clear
 */
KillLog.prototype.clear = function()
{
    this.logs.length = 0;
    this.emit('change');
};
