/**
 * Game Controller
 *
 * @param {Object} $scope
 * @param {Object} $routeParams
 * @param {SocketClient} client
 * @param {GameRepository} repository
 * @param {Chat} chat
 * @param {Radio} radio
 */
function GameController($scope, $routeParams, $location, client, repository, chat, radio, sound)
{
    AbstractController.call(this, $scope);

    document.body.classList.add('game-mode');

    this.$location       = $location;
    this.client          = client;
    this.repository      = repository;
    this.radio           = radio;
    this.chat            = chat;
    this.sound           = sound;
    this.room            = null;
    this.game            = null;
    this.assetsLoaded    = false;
    this.setup           = false;
    this.spectateMessage = null;

    // Binding
    this.checkReady   = this.checkReady.bind(this);
    this.onMove       = this.onMove.bind(this);
    this.onSpectate   = this.onSpectate.bind(this);
    this.onUnload     = this.onUnload.bind(this);
    this.onExit       = this.onExit.bind(this);
    this.onFirstRound = this.onFirstRound.bind(this);
    this.backToRoom   = this.backToRoom.bind(this);

    // Hydrate scope:
    this.$scope.radio           = this.radio;
    this.$scope.sound           = this.sound;
    this.$scope.backToRoom      = this.backToRoom;
    this.$scope.toggleSound     = this.sound.toggle;
    this.$scope.toggleRadio     = this.radio.toggle;
    this.$scope.avatars         = null;
    this.$scope.spectating      = false;
    this.$scope.$parent.profile = false;

    var name = decodeURIComponent($routeParams.name);

    this.repository.start();

    if (!this.repository.game || this.repository.game.name !== name) {
        this.$location.path('/room/' + encodeURIComponent(name));
    } else {
        this.loadGame(this.repository.game);
    }
}

GameController.prototype = Object.create(AbstractController.prototype);
GameController.prototype.constructor = GameController;

/**
 * Confirmation message
 *
 * @type {String}
 */
GameController.prototype.confirmation = 'Are you sure you want to leave the game?';

/**
 * Attach socket Events
 */
GameController.prototype.attachEvents = function()
{
    // Close on end?
    this.repository.on('spectate', this.onSpectate);
};

/**
 * Attach socket Events
 */
GameController.prototype.detachEvents = function()
{
    this.repository.off('spectate', this.onSpectate);
};

/**
 * Load game
 */
GameController.prototype.loadGame = function(game)
{
    this.offUnload        = this.$scope.$on('$locationChangeStart', this.onUnload);
    this.offDestroy       = this.$scope.$on('$destroy', this.onExit);
    window.onbeforeunload = this.onUnload;

    this.game = game;
    this.room = game.room;

    this.game.loadDOM();
    this.game.bonusManager.on('load', this.checkReady);

    gamepadListener.stop();

    for (var avatar, i = this.game.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.game.avatars.items[i];
        if (avatar.local) {
            avatar.input.on('move', this.onMove);
            if (avatar.input.useGamepad()) {
                gamepadListener.start();
            }
        }
    }

    this.radio.setActive(true);

    // Hydrate scope:
    this.$scope.game    = this.game;
    this.$scope.avatars = this.game.avatars.items;

    this.attachEvents();

    this.repository.on('round:new', this.onFirstRound);

    this.setup = true;
    this.checkReady();
};

/**
 * Check loading is done
 */
GameController.prototype.checkReady = function()
{
    if (this.game.bonusManager.loaded && this.setup) {
        this.game.bonusManager.off('load', this.checkReady);
        this.client.addEvent('ready');
    }
};

/**
 * Clear waiting list on first round
 *
 * @param {Event} e
 */
GameController.prototype.onFirstRound = function(e)
{
    setTimeout(function () { this.repository.off('round:new', this.onFirstRound); }.bind(this), 0);
    this.digestScope();
};

/**
 * On move
 *
 * @param {Event} e
 */
GameController.prototype.onMove = function(e)
{
    this.client.addEvent('player:move', {avatar: e.detail.avatar.id, move: e.detail.move ? e.detail.move : 0});
};

/**
 * On spectate
 */
GameController.prototype.onSpectate = function(e)
{
    document.getElementById('col-right').appendChild(this.getSpectateMessage());
    this.digestScope();
};

/**
 * Leave room
 */
GameController.prototype.onExit = function()
{
    if ((this.room && this.$location.path() !== this.room.getUrl()) || (this.game && this.game.started)) {
        this.repository.parent.leave();
        this.chat.clear();
    }

    window.onbeforeunload = null;

    this.sound.stop('win');
    this.offUnload();
    this.offDestroy();
    this.close();
};

/**
 * On unload
 *
 * @param {Event} e
 *
 * @return {String}
 */
GameController.prototype.onUnload = function(e)
{
    if (this.needConfirmation()) {
        if (e.type === 'beforeunload') {
            return this.confirmation;
        } else if (!confirm(this.confirmation)) {
            return e.preventDefault();
        }
    }
};

/**
 * Do we need confirmation before leaving?
 *
 * @return {Boolean}
 */
GameController.prototype.needConfirmation = function()
{
    return !this.$scope.spectating && this.game.started;
};

/**
 * Get spectate message
 *
 * @return {Element}
 */
GameController.prototype.getSpectateMessage = function()
{
    if (!this.spectateMessage) {
        this.spectateMessage           = document.createElement('div');
        this.spectateMessage.className = 'spectating';
        this.spectateMessage.innerHTML = '<h2><i class="icon-viewer"></i> You are in spectator mode</h2>';
        this.spectateMessage.innerHTML += '<p>You must wait for the game to finish before you can play.</p>';
    }

    return this.spectateMessage;
};

/**
 * Close game
 */
GameController.prototype.close = function()
{
    if (this.game) {
        this.detachEvents();

        var avatars = this.game.avatars.filter(function () { return this.input; }).items;

        for (var i = avatars.length - 1; i >= 0; i--) {
            avatars[i].input.off('move', this.onMove);
        }

        delete this.game;
    }
};

/**
 * Go back to the room
 */
GameController.prototype.backToRoom = function()
{
    this.$location.path(this.room.getUrl());

    if (!this.room.config.open) {
        this.$location.search('password', this.room.config.password);
    }
};
