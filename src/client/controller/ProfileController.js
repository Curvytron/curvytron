
/**
 * Curvytron Controller
 *
 * @param {Object} $scope
 * @param {Object} $element
 * @param {Profile} profile
 * @param {Analyser} analyser
 * @param {ActivityWatcher} watcher
 */
function ProfileController($scope, profile, radio, sound)
{
    AbstractController.call(this, $scope);

    this.profile  = profile;
    this.radio    = radio;
    this.sound    = sound;
    this.open     = false;
    this.loaded   = false;
    this.tuto     = null;
    this.panel    = null;
    this.controls = null;

    this.profile.controller = this;

    this.toggleProfile = this.toggleProfile.bind(this);
    this.openProfile   = this.openProfile.bind(this);
    this.closeProfile  = this.closeProfile.bind(this);
    this.onLoaded      = this.onLoaded.bind(this);
    this.onLoadControl = this.onLoadControl.bind(this);
    this.blurControls  = this.blurControls.bind(this);

    this.$scope.profile       = this.profile;
    this.$scope.radio         = this.radio;
    this.$scope.sound         = this.sound;
    this.$scope.toggleSound   = this.sound.toggle;
    this.$scope.toggleRadio   = this.radio.toggle;
    this.$scope.toggleProfile = this.toggleProfile;
    this.$scope.openProfile   = this.openProfile;
    this.$scope.closeProfile  = this.closeProfile;
    this.$scope.onLoaded      = this.onLoaded;
    this.$scope.onLoadControl = this.onLoadControl;
    this.$scope.blurControls  = this.blurControls;

    this.profile.on('change', this.digestScope);
}

ProfileController.prototype = Object.create(AbstractController.prototype);
ProfileController.prototype.constructor = ProfileController;

/**
 * On dom loaded
 */
ProfileController.prototype.onLoaded = function()
{
    this.panel  = document.querySelector('.panel');
    this.tuto   = this.panel.querySelector('.profile-tuto');
    this.loaded = true;
    this.emit('loaded');
};

/**
 * On dom loaded controls
 */
ProfileController.prototype.onLoadControl = function()
{
    this.controls = this.panel.querySelectorAll('input.control');
};

/**
 * Open profile
 */
ProfileController.prototype.openProfile = function()
{
    if (!this.open) {
        this.open = true;
        this.panel.classList.add('active');
        this.tuto.classList.toggle('active', !this.profile.isComplete());
        this.profile.emit('open');
    }
};

/**
 * Close profile
 */
ProfileController.prototype.closeProfile = function()
{
    if (this.open && this.profile.isComplete()) {
        this.open = false;
        this.panel.classList.remove('active');
        this.tuto.classList.toggle('active', !this.profile.isComplete());
        this.profile.emit('close');
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
 * Blur controls
 */
ProfileController.prototype.blurControls = function()
{
    this.controls[0].blur();
    this.controls[1].blur();
};
