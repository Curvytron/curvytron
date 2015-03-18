/**
 * Curvytron Controller
 *
 * @param {Object} $scope
 * @param {Object} $window
 * @param {Profile} profile
 * @param {Analyser} analyser
 * @param {ActivityWatcher} watcher
 */
function CurvytronController($scope, $window, profile, analyser, watcher, client)
{
    this.$scope   = $scope;
    this.$window  = $window;
    this.profile  = profile;
    this.analyser = analyser;
    this.watcher  = watcher;
    this.client   = client;

    // Bind
    this.toggleProfile = this.toggleProfile.bind(this);
    this.openProfile   = this.openProfile.bind(this);
    this.closeProfile  = this.closeProfile.bind(this);
    this.blurProfile   = this.blurProfile.bind(this);
    this.onConnect     = this.onConnect.bind(this);
    this.onDisconnect  = this.onDisconnect.bind(this);
    this.reload        = this.reload.bind(this);

    // Hydrate scope
    this.$scope.curvytron   = {bodyClass: ''};
    this.$scope.profileOpen = false;
    this.$scope.profileTuto = false;
    this.$scope.status      = 'connecting';
    this.$scope.profile     = profile;

    this.$scope.toggleProfile = this.toggleProfile;
    this.$scope.openProfile   = this.openProfile;
    this.$scope.closeProfile  = this.closeProfile;
    this.$scope.blurProfile   = this.blurProfile;
    this.$scope.reload        = this.reload;

    this.client.on('connected', this.onConnect);
    this.client.on('disconnected', this.onDisconnect);
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
    if (this.profile.isComplete()) {
        this.$scope.profileOpen = false;
        this.$scope.profileTuto = !this.profile.isComplete();

        this.profile.emit('close');
    }
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

/**
 * On connect
 *
 * @param {Event} e
 */
CurvytronController.prototype.onConnect = function(e)
{
    this.$scope.status = 'online';
    this.applyScope();
};

/**
 * On disconnect
 *
 * @param {Event} e
 */
CurvytronController.prototype.onDisconnect = function(e)
{
    this.$scope.status    = 'disconnected';
    this.$scope.curvytron = { bodyClass: '' };
    this.applyScope();
};

/**
 * Reload
 */
CurvytronController.prototype.reload = function()
{
    this.$window.location.href = '/';
};

/**
 * Apply scope
 */
CurvytronController.prototype.applyScope = function(fn)
{
    var phase = this.$scope.$root ? this.$scope.$root.$$phase : null;

    if(phase !== '$apply' && phase !== '$digest') {
        this.$scope.$apply();
    }
};
