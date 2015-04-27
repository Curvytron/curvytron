/**
 * Curvytron Controller
 *
 * @param {Object} $scope
 * @param {Object} $window
 * @param {Object} $location
 * @param {Profile} profile
 * @param {Analyser} analyser
 * @param {ActivityWatcher} watcher
 */
function CurvytronController($scope, $window, $location, profile, analyser, watcher, client)
{
    this.$scope    = $scope;
    this.$window   = $window;
    this.$location = $location;
    this.analyser  = analyser;
    this.watcher   = watcher;
    this.client    = client;

    // Bind
    this.onConnect     = this.onConnect.bind(this);
    this.onDisconnect  = this.onDisconnect.bind(this);
    this.reload        = this.reload.bind(this);

    // Hydrate scope
    this.$scope.status  = 'connecting';
    this.$scope.reload  = this.reload;
    this.$scope.profile = false;

    this.client.on('connected', this.onConnect);
    this.client.on('disconnected', this.onDisconnect);
}

/**
 * On connect
 *
 * @param {Event} e
 */
CurvytronController.prototype.onConnect = function(e)
{
    this.$scope.status  = 'online';
    this.$scope.profile = true;
    this.digestScope();
};

/**
 * On disconnect
 *
 * @param {Event} e
 */
CurvytronController.prototype.onDisconnect = function(e)
{
    document.body.classList.remove('game-mode');
    this.$scope.status = 'disconnected';
    this.digestScope();
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
CurvytronController.prototype.applyScope = function()
{
    var phase = this.$scope && this.$scope.$root ? this.$scope.$root.$$phase : null;

    if (phase !== '$apply' && phase !== '$digest') {
        this.$scope.$apply();
    }
};

/**
 * Digest scope
 */
CurvytronController.prototype.digestScope = function()
{
    var phase = this.$scope && this.$scope.$root ? this.$scope.$root.$$phase : null;

    if (phase !== '$apply' && phase !== '$digest') {
        this.$scope.$digest();
    }
};
