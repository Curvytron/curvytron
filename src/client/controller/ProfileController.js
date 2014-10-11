/**
 * Profile Controller
 *
 * @param {Object} $scope
 * @param {Profile} profile
 */
function ProfileController($scope, profile)
{
    gamepadListener.start();

    this.$scope  = $scope;
    this.profile = profile;

    // Binding
    this.applyScope      = this.applyScope.bind(this);
    this.save            = this.save.bind(this);
    this.onControlChange = this.onControlChange.bind(this);
    this.blur            = this.blur.bind(this);

    // Hydrate scope
    this.$scope.profile = profile;
    this.$scope.save    = this.save;
    this.$scope.blur    = this.blur;

    var labels = ['Left', 'Right'];

    for (var i = this.profile.controls.length - 1; i >= 0; i--) {
        this.profile.controls[i].label = labels[i];
    }

    this.profile.on('change', this.onControlChange);
}

/**
 * Save
 */
ProfileController.prototype.save = function()
{
    this.profile.persist();
};

/**
 *
 * Profile
 *
 * @param {Event} e
 */
ProfileController.prototype.onControlChange = function()
{
    this.blur();
    this.applyScope();
};

/**
 * Blur control fields
 */
ProfileController.prototype.blur = function()
{
    for (var i = this.profile.controls.length - 1; i >= 0; i--) {
         angular.element(document.querySelector('#profile-controls-' + i))[0].blur();
    }
};

/**
 * Apply scope
 */
ProfileController.prototype.applyScope = function()
{
    try {
        this.$scope.$apply();
    } catch (e) {

    }
};
