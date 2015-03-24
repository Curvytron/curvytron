/**
 * Kill log
 */
function KillLog()
{
    this.$scope = null;
    this.logs   = new Collection([], 'id', true);
}

/**
 * Message display duration
 *
 * @type {Number}
 */
KillLog.prototype.display = 5000;

/**
 * Curvybot profile
 *
 * @type {Object}
 */
KillLog.prototype.curvybot = {
    name: 'Curvybot',
    color: '#ff8069',
    icon: 'icon-megaphone'
};

/**
 * Load the death of a player's avatar
 *
 * @param {Avatar} avatar
 * @param {Avatar|null} killer
 */
KillLog.prototype.logDeath = function(avatar, killer)
{
    console.log('logDeath');
    this.logs.add(new DieMessage(this.curvybot, avatar, killer), this.display);

    if (this.$scope) {
        this.applyScope();
    }
};

/**
 * Set scope
 */
KillLog.prototype.setScope = function($scope)
{
    this.clearMessages();

    this.$scope      = $scope;
    this.$scope.logs = this.logs.items;
};

/**
 * Clear messages
 */
KillLog.prototype.clearMessages = function()
{
    this.logs.length = 0;
};

/**
 * Clear
 */
KillLog.prototype.clear = function()
{
    this.clearMessages();

    this.$scope  = null;
};

/**
 * Apply scope
 */
KillLog.prototype.applyScope = CurvytronController.prototype.applyScope;
