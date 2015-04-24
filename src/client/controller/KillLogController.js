/**
 * Kill Log Controller
 *
 * @param {Object} $scope
 * @param {KillLog} killLog
 */
function KillLogController($scope, killLog)
{
    this.$scope  = $scope;
    this.killLog = killLog;
    this.element = null;

    this.onLoaded    = this.onLoaded.bind(this);
    this.onChange    = this.onChange.bind(this);
    this.applyScope  = this.applyScope.bind(this);
    this.digestScope = this.digestScope.bind(this);

    this.$scope.onLoaded = this.onLoaded;
    this.$scope.logs     = this.killLog.logs;

    this.killLog.on('change', this.digestScope);
}

/**
 * On kill log DOM element loaded
 */
KillLogController.prototype.onLoaded = function ()
{
    this.element = document.getElementById('kill-log-feed');
    this.scrollDown();
};

/**
 * On change
 *
 * @param {Event} event
 */
KillLogController.prototype.onChange = function(event)
{
    this.digestScope();
    this.scrollDown();
};

/**
 * Scroll down
 */
KillLogController.prototype.scrollDown = function()
{
    if (this.element) {
        this.element.scrollTop = this.element.scrollHeight;
    }
};

/**
 * Apply scope
 */
KillLogController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
KillLogController.prototype.digestScope = CurvytronController.prototype.digestScope;
