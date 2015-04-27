/**
 * Waiting players connection controller
 *
 * @param {Object} $scope
 * @param {SocketClient} client
 */
function WaitingController($scope, client)
{
    if (!$scope.game) { return; }

    this.$scope = $scope;
    this.client = client;
    this.game   = $scope.game;

    // Binding
    this.onReady      = this.onReady.bind(this);
    this.onStart      = this.onStart.bind(this);
    this.detachEvents = this.detachEvents.bind(this);

    // Hydrate scope
    this.$scope.waitingList = this.game.avatars.items.slice(0);

    this.$scope.$on('$destroy', this.detachEvents);

    this.attachEvents();
}

/**
 * Attach socket Events
 */
WaitingController.prototype.attachEvents = function()
{
    this.client.on('ready', this.onReady);
    this.client.on('round:new', this.onStart);
};

/**
 * Attach socket Events
 */
WaitingController.prototype.detachEvents = function()
{
    this.client.off('ready', this.onReady);
    this.client.off('round:new', this.onStart);
};

/**
 * On avatar ready (client loaded)
 *
 * @param {Event} e
 */
WaitingController.prototype.onReady = function(e)
{
    var avatar = this.game.avatars.getById(e.detail.avatar),
        index  = this.$scope.list.indexOf(avatar);

    if (avatar && index) {
        this.$scope.list.splice(index, 1);
        this.digestScope();
    }
};

/**
 * On game start
 *
 * @param {Event} e
 */
WaitingController.prototype.onStart = function(e)
{
    console.log('onStart');
    delete this.$scope.list;
    this.detachEvents();
    //this.$scope.$parent.$apply();
};

/**
 * Apply scope
 */
WaitingController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
WaitingController.prototype.digestScope = CurvytronController.prototype.digestScope;
