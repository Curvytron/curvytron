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

    this.onChange = this.onChange.bind(this);

    this.$scope.logs = this.killLog.logs.items;

    this.killLog.on('change', this.onChange);
}

/**
 * On change
 *
 * @param {Event} event
 */
KillLogController.prototype.onChange = function(event)
{
    this.applyScope();
};

/**
 * Apply scope
 */
KillLogController.prototype.applyScope = CurvytronController.prototype.applyScope;
