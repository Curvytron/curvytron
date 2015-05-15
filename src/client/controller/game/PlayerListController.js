/**
 * Player List Controller
 *
 * @param {Object} $scope
 * @param {SocketClient} client
 */
function PlayerListController($scope, client)
{
    if (!$scope.game) { return; }

    this.$scope = $scope;
    this.client = client;
    this.game   = this.$scope.game;

    // Binding
    this.onScore      = this.onScore.bind(this);
    this.onRoundScore = this.onRoundScore.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.applyScope   = this.applyScope.bind(this);
    this.digestScope  = this.digestScope.bind(this);

    this.$scope.$on('$destroy', this.detachEvents);

    this.attachEvents();
}

/**
 * Attach socket Events
 */
PlayerListController.prototype.attachEvents = function()
{
    this.client.on('score', this.onScore);
    this.client.on('score:round', this.onRoundScore);
    this.client.on('game:leave', this.digestScope);
    this.client.on('round:new', this.digestScope);
};

/**
 * Attach socket Events
 */
PlayerListController.prototype.detachEvents = function()
{
    this.client.off('score', this.onScore);
    this.client.off('score:round', this.onRoundScore);
    this.client.off('game:leave', this.digestScope);
    this.client.off('round:new', this.digestScope);
};

/**
 * On score
 *
 * @param {Event} e
 */
PlayerListController.prototype.onScore = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.setScore(e.detail[1]);
        this.game.sortAvatars();
        this.digestScope();
    }
};

/**
 * On round score
 *
 * @param {Event} e
 */
PlayerListController.prototype.onRoundScore = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.setRoundScore(e.detail[1]);
        this.game.sortAvatars();
        this.digestScope();
    }
};

/**
 * Apply scope
 */
PlayerListController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
PlayerListController.prototype.digestScope = CurvytronController.prototype.digestScope;
