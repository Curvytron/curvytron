/**
 * Curvytron Controller
 *
 * @param {Object} $scope
 * @param {Profile} profile
 */
function CurvytronController($scope, profile)
{
    this.$scope  = $scope;
    this.profile = profile;

    // Bind
    this.toggleProfile = this.toggleProfile.bind(this);
    this.openProfile   = this.openProfile.bind(this);
    this.closeProfile  = this.closeProfile.bind(this);
    this.blurProfile   = this.blurProfile.bind(this);

    // Hydrate scope
    this.$scope.curvytron     = { bodyClass: '' };
    this.$scope.profileOpen   = false;
    this.$scope.profileTuto   = false;
    this.$scope.profile       = profile;

    this.$scope.toggleProfile = this.toggleProfile;
    this.$scope.openProfile   = this.openProfile;
    this.$scope.closeProfile  = this.closeProfile;
    this.$scope.blurProfile   = this.blurProfile;
}

/**
 * Open profile
 */
CurvytronController.prototype.openProfile = function()
{
    this.$scope.profileOpen = true;
    this.$scope.profileTuto = !this.profile.isComplete();

    this.profile.emit('open');
};

/**
 * Close profile
 */
CurvytronController.prototype.closeProfile = function()
{
    if (!this.profile.isComplete()) { return; }

    this.$scope.profileOpen = false;
    this.$scope.profileTuto = false;

    this.profile.emit('close');
};

/**
 * Toggle profile
 */
CurvytronController.prototype.toggleProfile = function()
{
    return this.$scope.profileOpen ? this.closeProfile() : this.openProfile();
};

/**
 * Toggle profile
 */
CurvytronController.prototype.blurProfile = function(e)
{
    for (var i = this.profile.controls.length - 1; i >= 0; i--) {
         angular.element(document.querySelector('#profile-controls-' + i))[0].blur();
    }
};