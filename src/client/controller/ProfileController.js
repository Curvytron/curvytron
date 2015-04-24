
/**
 * Curvytron Controller
 *
 * @param {Object} $scope
 * @param {Object} $element
 * @param {Profile} profile
 * @param {Analyser} analyser
 * @param {ActivityWatcher} watcher
 */
function ProfileController($scope, $element, profile, radio, sound)
{
    this.$scope   = $scope;
    this.profile  = profile;
    this.radio    = radio;
    this.sound    = sound;
    this.panel    = $element[0].querySelector('.panel');
    this.tuto     = null;
    this.controls = null;
    this.open     = false;

    this.profile.controller = this;

    this.toggleProfile = this.toggleProfile.bind(this);
    this.openProfile   = this.openProfile.bind(this);
    this.closeProfile  = this.closeProfile.bind(this);
    this.blurProfile   = this.blurProfile.bind(this);

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
    if (!this.open) {
        if (!this.tuto) {
            this.tuto     = this.panel.querySelector('.profile-tuto');
            this.controls = this.panel.querySelectorAll('input.control');
        }

        this.panel.classList.add('active');
        this.tuto.classList.toggle('active', !this.profile.isComplete());
        this.profile.emit('open');
        this.open = true;
    }
};

/**
 * Close profile
 */
ProfileController.prototype.closeProfile = function()
{
    if (this.open && this.profile.isComplete()) {
        this.panel.classList.remove('active');
        this.tuto.classList.toggle('active', !this.profile.isComplete());
        this.profile.emit('close');
        this.open = false;
    }
};

/**
 * Toggle profile
 */
ProfileController.prototype.toggleProfile = function()
{
    return this.open ? this.closeProfile() : this.openProfile();
};

/**
 * Toggle profile
 */
ProfileController.prototype.blurProfile = function(e)
{
    for (var i = this.profile.controls.length - 1; i >= 0; i--) {
        this.controls[i].blur();
    }
};
