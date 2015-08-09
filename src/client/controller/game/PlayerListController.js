/**
 * Player List Controller
 *
 * @param {Object} $scope
 * @param {Object} $element
 * @param {SocketClient} client
 */
function PlayerListController($scope, $element, client)
{
    if (!$scope.game) { return; }

    AbstractController.call(this, $scope);

    this.element  = $element;
    this.client   = client;
    this.game     = this.$scope.game;
    this.elements = [];

    // Binding
    this.onScore      = this.onScore.bind(this);
    this.onRoundScore = this.onRoundScore.bind(this);
    this.onRoundNew   = this.onRoundNew.bind(this);
    this.onRoundEnd   = this.onRoundEnd.bind(this);
    this.onDie        = this.onDie.bind(this);
    this.detachEvents = this.detachEvents.bind(this);

    this.$scope.onLoad = function (avatar) {
        setTimeout(function () { this.onLoad(avatar); }.bind(this), 0);
    }.bind(this);

    this.$scope.$on('$destroy', this.detachEvents);

    this.attachEvents();
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
    this.client.on('round:new', this.onRoundNew);
    this.client.on('round:end', this.onRoundEnd);
    this.client.on('die', this.onDie);
};

/**
 * Attach socket Events
 */
PlayerListController.prototype.detachEvents = function()
{
    this.client.off('score', this.onScore);
    this.client.off('score:round', this.onRoundScore);
    this.client.off('game:leave', this.requestDigestScope);
    this.client.off('round:new', this.onRoundNew);
    this.client.off('round:end', this.onRoundEnd);
    this.client.off('die', this.onDie);
};

/**
 * On load
 *
 * @param {Avatar} avatar
 */
PlayerListController.prototype.onLoad = function(avatar) {
    avatar.elements.root       = angular.element(document.getElementById('avatar-' + avatar.id));
    avatar.elements.score      = angular.element(document.getElementById('avatar-score-' + avatar.id));
    avatar.elements.roundScore = angular.element(document.getElementById('avatar-round-score-' + avatar.id));

    if (avatar.local) {
        avatar.elements.root.addClass('local');
    }
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
        this.updateScore(avatar);
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
        this.updateRoundScore(avatar);
    }
};

/**
 * On round new
 *
 * @param {Event} e
 */
PlayerListController.prototype.onRoundNew = function(e)
{
    //this.requestDigestScope();

    this.element.addClass('in-round');

    for (var i = this.game.avatars.items.length - 1; i >= 0; i--) {
        this.updateClass(this.game.avatars.items[i], false);
    }
};

/**
 * On round dnd
 *
 * @param {Event} e
 */
PlayerListController.prototype.onRoundEnd = function(e)
{
    this.element.removeClass('in-round');
    this.reorder();
};

/**
 * On die
 *
 * @param {Event} e
 */
PlayerListController.prototype.onDie = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        this.updateClass(avatar, true);
    }
};

/**
 * Update score
 *
 * @param {Avatar} avatar
 */
PlayerListController.prototype.updateScore = function(avatar)
{
    if (avatar.elements.score) {
        avatar.elements.score.text(avatar.score);
    }
};


/**
 * Update round score
 *
 * @param {Avatar} avatar
 */
PlayerListController.prototype.updateRoundScore = function(avatar)
{
    if (avatar.elements.roundScore) {
        avatar.elements.roundScore.text(avatar.roundScore ? '+' + avatar.roundScore : '');
    }
};

/**
 * Update class
 *
 * @param {Avatar} avatar
 */
PlayerListController.prototype.updateClass = function(avatar, dead)
{
    if (avatar.elements.root) {
        avatar.elements.root.toggleClass('dead', dead);
    }
};

/**
 * Reorder player list
 */
PlayerListController.prototype.reorder = function() {
    var length = this.game.sortAvatars().items.length;

    for (var avatar, i = 0; i < length; i++) {
        avatar = this.game.avatars.items[i];
        avatar.elements.root.parent().append(avatar.elements.root);
    }
};
