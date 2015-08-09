/**
 * Player List Controller
 *
 * @param {Object} $scope
 * @param {SocketClient} client
 */
function PlayerListController($scope, client)
{
    if (!$scope.game) { return; }

    AbstractController.call(this, $scope);

    this.client = client;
    this.game   = this.$scope.game;

    // Binding
    this.onScore      = this.onScore.bind(this);
    this.onRoundScore = this.onRoundScore.bind(this);
    this.detachEvents = this.detachEvents.bind(this);

    this.$scope.$on('$destroy', this.detachEvents);

    //this.attachEvents();
}

PlayerListController.prototype = Object.create(AbstractController.prototype);
PlayerListController.prototype.constructor = PlayerListController;

/**
 * Attach socket Events
 */
PlayerListController.prototype.attachEvents = function()
{
    this.client.on('score', this.onScore);
    this.client.on('score:round', this.onRoundScore);
    this.client.on('game:leave', this.requestDigestScope);
    this.client.on('round:new', this.requestDigestScope);
};

/**
 * Attach socket Events
 */
PlayerListController.prototype.detachEvents = function()
{
    this.client.off('score', this.onScore);
    this.client.off('score:round', this.onRoundScore);
    this.client.off('game:leave', this.requestDigestScope);
    this.client.off('round:new', this.requestDigestScope);
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
        this.requestDigestScope();
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
        var t = new StopWatch('setRoundScore');
        avatar.setRoundScore(e.detail[1]);
        t.stop();
        var t = new StopWatch('sortAvatars');
        this.game.sortAvatars();
        t.stop();
        var t = new StopWatch('requestDigestScope');
        this.requestDigestScope();
        t.stop();
    }
};
