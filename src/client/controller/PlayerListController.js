/**
 * Player List Controller
 *
 * @param {Object} $scope
 * @param {RoomRepository} repository
 * @param {SocketClient} client
 */
function PlayerListController($scope, repository, client)
{
    this.$scope     = $scope;
    this.repository = repository;
    this.client     = client;
    this.game       = null;

    this.onChange     = this.onChange.bind(this);
    this.onScore      = this.onScore.bind(this);
    this.onRoundScore = this.onRoundScore.bind(this);

    if (this.repository.room) {
        if (this.repository.room.game) {
            this.loadGame();
        } else {
            this.repository.room.on('game:new', this.loadGame);
        }
    }
}

/**
 * Load game
 */
PlayerListController.prototype.loadGame = function()
{
    this.repository.room.off('game:new', this.loadGame);

    this.game = this.repository.room.game;

    this.attachSocketEvents();
};

/**
 * Attach socket Events
 */
PlayerListController.prototype.attachSocketEvents = function()
{
    this.client.on('score', this.onScore);
    this.client.on('score:round', this.onRoundScore);
    this.client.on('game:leave', this.onChange);
    this.client.on('round:new', this.onChange);
};

/**
 * Attach socket Events
 */
PlayerListController.prototype.detachSocketEvents = function()
{
    this.client.off('score', this.onScore);
    this.client.off('score:round', this.onRoundScore);
    this.client.off('game:leave', this.onChange);
    this.client.off('round:new', this.onChange);
};

/**
 * On score
 *
 * @param {Event} e
 */
PlayerListController.prototype.onScore = function(e)
{
    var avatar = this.game.avatars.getById(e.detail.avatar);

    if (avatar) {
        avatar.setScore(e.detail.score);
        this.applyScope();
    }
};

/**
 * On round score
 *
 * @param {Event} e
 */
PlayerListController.prototype.onRoundScore = function(e)
{
    var avatar = this.game.avatars.getById(e.detail.avatar);

    if (avatar) {
        avatar.setRoundScore(e.detail.score);
        this.applyScope();
    }
};

/**
 * On leave
 *
 * @param {Event} e
 */
PlayerListController.prototype.onChange = function(e)
{
    this.applyScope();
};

/**
 * Apply scope
 */
PlayerListController.prototype.applyScope = CurvytronController.prototype.applyScope;
