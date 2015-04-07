
/**
 * Curvytron Controller
 *
 * @param {Object} $scope
 * @param {Object} $window
 * @param {Profile} profile
 * @param {Analyser} analyser
 * @param {ActivityWatcher} watcher
 */
function ProfileController($scope, profile, radio, sound)
{
    this.$scope  = $scope;
    this.profile = profile;
    this.radio   = radio;
    this.sound   = sound;

    this.profile.controller = this;

    this.toggleProfile = this.toggleProfile.bind(this);
    this.openProfile   = this.openProfile.bind(this);
    this.closeProfile  = this.closeProfile.bind(this);
    this.blurProfile   = this.blurProfile.bind(this);

    this.$scope.profileOpen   = false;
    this.$scope.profileTuto   = false;
    this.$scope.profile       = this.profile;
    this.$scope.radio         = this.radio;
    this.$scope.sound         = this.sound;
    this.$scope.toggleSound   = this.sound.toggle;
    this.$scope.toggleRadio   = this.radio.toggle;
    this.$scope.toggleProfile = this.toggleProfile;
    this.$scope.openProfile   = this.openProfile;
    this.$scope.closeProfile  = this.closeProfile;
    this.$scope.blurProfile   = this.blurProfile;
}

/**
 * Open profile
 */
ProfileController.prototype.openProfile = function()
{
    this.$scope.profileOpen = true;
    this.$scope.profileTuto = !this.profile.isComplete();
    this.profile.emit('open');
};

/**
 * Close profile
 */
ProfileController.prototype.closeProfile = function()
{
    if (this.profile.isComplete()) {
        this.$scope.profileOpen = false;
        this.$scope.profileTuto = !this.profile.isComplete();
        this.profile.emit('close');
    }
};

/**
 * Toggle profile
 */
ProfileController.prototype.toggleProfile = function()
{
    return this.$scope.profileOpen ? this.closeProfile() : this.openProfile();
};

/**
 * Toggle profile
 */
ProfileController.prototype.blurProfile = function(e)
{
    for (var i = this.profile.controls.length - 1; i >= 0; i--) {
        angular.element(document.querySelector('#profile-controls-' + i))[0].blur();
    }
};

/**
 * Apply scope
 */
ProfileController.prototype.applyScope = CurvytronController.prototype.applyScope;
