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

    this.onLoaded = this.onLoaded.bind(this);
    this.onChange = this.onChange.bind(this);

    this.$scope.killLogLoaded = this.onLoaded;
    this.$scope.logs          = this.killLog.logs;

    this.killLog.on('change', this.onChange);
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
    this.applyScope();
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
