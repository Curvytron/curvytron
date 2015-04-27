/**
 * Metric controller
 *
 * @param {Object} $scope
 * @param {SocketClient} client
 */
function MetricController($scope, client)
{
    if (!$scope.game) { return; }

    this.$scope = $scope;
    this.client = client;
    this.game   = this.$scope.game;

    // Binding
    this.onFPS        = this.onFPS.bind(this);
    this.onLatency    = this.onLatency.bind(this);
    this.onSpectators = this.onSpectators.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.applyScope   = this.applyScope.bind(this);
    this.digestScope  = this.digestScope.bind(this);

    // Hydrate scope:
    this.$scope.fps        = this.game.fps;
    this.$scope.latency    = 0;
    this.$scope.spectators = 0;

    this.$scope.$on('$destroy', this.detachEvents);

    this.attachEvents();
}

/**
 * Attach events
 */
MetricController.prototype.attachEvents = function()
{
    this.client.on('latency', this.onLatency);
    this.client.on('game:spectators', this.onSpectators);
    this.game.on('fps', this.onFPS);
};

/**
 * Detach events
 */
MetricController.prototype.detachEvents = function()
{
    this.client.off('latency', this.onLatency);
    this.client.off('game:spectators', this.onSpectators);
    this.game.off('fps', this.onFPS);
};

/**
 * On FPS
 *
 * @param {Event} event
 */
MetricController.prototype.onFPS = function(event)
{
    this.digestScope();
};

/**
 * On latency
 *
 * @param {Event} event
 */
MetricController.prototype.onLatency = function(event)
{
    var value = event.detail[0];

    this.$scope.latency      = value;
    this.$scope.latencyColor = value <= 100 ? 'green' : (value <= 250 ? 'orange' : 'red');

    this.digestScope();
};

/**
 * On spectators
 *
 * @param {Event} event
 */
MetricController.prototype.onSpectators = function(event)
{
    this.$scope.spectators = event.detail;
    this.digestScope();
};

/**
 * On FPS
 *
 * @param {Event} event
 */
MetricController.prototype.onFPS = function(event)
{
    this.digestScope();
};

/**
 * Apply scope
 */
MetricController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
MetricController.prototype.digestScope = CurvytronController.prototype.digestScope;
