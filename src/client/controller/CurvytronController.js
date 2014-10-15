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
    this.blurProfile   = this.blurProfile.bind(this);

    // Hydrate scope
    this.$scope.curvytron     = { bodyClass: '' };
    this.$scope.profileOpen   = false;
    this.$scope.profile       = profile;

    this.$scope.toggleProfile = this.toggleProfile;
    this.$scope.blurProfile   = this.blurProfile;
}

/**
 * Toggle profile
 */
CurvytronController.prototype.toggleProfile = function()
{
    this.$scope.profileOpen = !this.$scope.profileOpen;
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