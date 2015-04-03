/**
 * Kill log
 */
function KillLog()
{
    EventEmitter.call(this);

    this.logs = new Collection([], 'index', true);
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
 * MAx messages to be displayed at the same time
 *
 * @type {Number}
 */
KillLog.prototype.maxlength = 10;

/**
 * Curvybot profile
 *
 * @type {Object}
 */
KillLog.prototype.curvybot = {
    name: 'Curvybot',
    color: '#ff8069',
    icon: 'icon-dead'
};

/**
 * Load the death of a player's avatar
 *
 * @param {Avatar} avatar
 * @param {Avatar|null} killer
 */
KillLog.prototype.logDeath = function(avatar, killer)
{
    this.addMessage(new DieMessage(this.curvybot, avatar, killer));
};

/**
 * Kill log
 *
 * @param {DieMessage} message
 */
KillLog.prototype.addMessage = function(message)
{
    var killLog = this;
    this.logs.add(message);
    setTimeout(function () { killLog.removeMessage(message); }, this.display);
    this.emit('change');
};

/**
 * Remove message
 *
 * @param {DieMessage} message
 */
KillLog.prototype.removeMessage = function (message)
{
    if (this.logs.remove(message)) {
        this.emit('change');
    }
};

/**
 * Clear
 */
KillLog.prototype.clear = function()
{
    this.logs.clear();
};
