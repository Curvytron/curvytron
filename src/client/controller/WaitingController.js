/**
 * Waiting players connection controller
 *
 * @param {Object} $scope
 * @param {RoomRepository} repoository
 * @param {SocketClient} client
 */
function WaitingController($scope, repository, client)
{
    if (!repository.room || !repository.room.game) { return; }

    this.$scope     = $scope;
    this.repository = repository;
    this.client     = client;
    this.game       = this.repository.room.game;
    this.list       = this.repository.room.game.avatars.items.slice(0);

    // Binding
    this.onReady      = this.onReady.bind(this);
    this.detachEvents = this.detachEvents.bind(this);

    // Hydrate scope
    this.$scope.waitingList = this.list;

    this.$scope.$on('$destroy', this.detachEvents);

    this.attachEvents();
}

/**
 * Attach socket Events
 */
WaitingController.prototype.attachEvents = function()
{
    this.client.on('ready', this.onReady);
};

/**
 * Attach socket Events
 */
WaitingController.prototype.detachEvents = function()
{
    this.client.off('ready', this.onReady);
};

/**
 * On avatar ready (client loaded)
 *
 * @param {Event} e
 */
WaitingController.prototype.onReady = function(e)
{
    var avatar = this.game.avatars.getById(e.detail.avatar),
        index  = this.list.indexOf(avatar);

    if (avatar && index) {
        this.list.splice(index, 1);
        this.digestScope();
    }
};

/**
 * Apply scope
 */
WaitingController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
WaitingController.prototype.digestScope = CurvytronController.prototype.digestScope;
