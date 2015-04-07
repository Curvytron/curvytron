/**
 * Room Controller
 *
 * @param {Object} $scope
 * @param {Object} $routeParams
 * @param {Object} $location
 * @param {SocketClient} SocketClient
 * @param {RoomRepository} repository
 * @param {Profile} profile
 * @param {Chat} chat
 * @param {Notifier} notifier
 */
function RoomController($scope, $routeParams, $location, client, repository, profile, chat, notifier)
{
    this.$scope         = $scope;
    this.$location      = $location;
    this.client         = client;
    this.profile        = profile;
    this.chat           = chat;
    this.notifier       = notifier;
    this.hasTouch       = typeof(window.ontouchstart) !== 'undefined';
    this.name           = decodeURIComponent($routeParams.name);
    this.repository     = repository;
    this.controlSynchro = false;
    this.useTouch       = false;

    // Binding:
    this.addPlayer        = this.addPlayer.bind(this);
    this.addProfileUser   = this.addProfileUser.bind(this);
    this.removePlayer     = this.removePlayer.bind(this);
    this.kickPlayer       = this.kickPlayer.bind(this);
    this.applyScope       = this.applyScope.bind(this);
    this.onJoin           = this.onJoin.bind(this);
    this.onJoined         = this.onJoined.bind(this);
    this.onControlChange  = this.onControlChange.bind(this);
    this.joinRoom         = this.joinRoom.bind(this);
    this.leaveRoom        = this.leaveRoom.bind(this);
    this.setColor         = this.setColor.bind(this);
    this.setReady         = this.setReady.bind(this);
    this.setName          = this.setName.bind(this);
    this.setTouch         = this.setTouch.bind(this);
    this.updateProfile    = this.updateProfile.bind(this);
    this.toggleParameters = this.toggleParameters.bind(this);
    this.onRoomMaster     = this.onRoomMaster.bind(this);
    this.start            = this.start.bind(this);

    this.$scope.$on('$destroy', this.leaveRoom);

    // Hydrating scope:
    this.$scope.submitAddPlayer     = this.addPlayer;
    this.$scope.removePlayer        = this.removePlayer;
    this.$scope.kickPlayer          = this.kickPlayer;
    this.$scope.setColor            = this.setColor;
    this.$scope.setReady            = this.setReady;
    this.$scope.setName             = this.setName;
    this.$scope.setTouch            = this.setTouch;
    this.$scope.toggleParameters    = this.toggleParameters;
    this.$scope.nameMaxLength       = Player.prototype.maxLength;
    this.$scope.colorMaxLength      = Player.prototype.colorMaxLength;
    this.$scope.hasTouch            = this.hasTouch;
    this.$scope.master              = this.repository.amIMaster();
    this.$scope.curvytron.bodyClass = null;
    this.$scope.displayParameters   = false;
    this.$scope.$parent.profile     = true;

    this.repository.start();

    if (!this.profile.isComplete()) {
        this.profile.on('close', this.joinRoom);
        this.profile.controller.openProfile();
    } else {
        this.joinRoom();
    }
}

/**
 * Join room and load scope
 */
RoomController.prototype.joinRoom = function()
{
    if (!this.client.connected) {
        return this.client.on('connected', this.joinRoom);
    }

    this.profile.off('close', this.joinRoom);
    this.repository.join(this.name, this.onJoined);
};

/**
 * On room joined
 *
 * @param {Object} result
 */
RoomController.prototype.onJoined = function(result)
{
    if (result.success) {
        this.room        = result.room;
        this.$scope.room = this.room;

        this.attachEvents();
        this.addProfileUser();
    } else {
        console.error('Could not join room %s', name);
        this.goHome();
    }

    this.applyScope();
};

/**
 * Leave room
 */
RoomController.prototype.leaveRoom = function()
{
    if (this.room && this.$location.path() !== this.room.gameUrl) {
        this.repository.leave();
    }

    this.detachEvents();
};

/**
 * Attach Events
 *
 * @param {String} name
 */
RoomController.prototype.attachEvents = function(name)
{
    this.repository.on('room:close', this.goHome);
    this.repository.on('player:join', this.onJoin);
    this.repository.on('player:leave', this.applyScope);
    this.repository.on('player:ready', this.applyScope);
    this.repository.on('player:color', this.applyScope);
    this.repository.on('player:name', this.applyScope);
    this.repository.on('client:activity', this.applyScope);
    this.repository.on('room:master', this.onRoomMaster);
    this.repository.on('room:game:start', this.start);

    for (var i = this.room.players.items.length - 1; i >= 0; i--) {
        this.room.players.items[i].on('control:change', this.onControlChange);
    }
};

/**
 * Attach Events
 *
 * @param {String} name
 */
RoomController.prototype.detachEvents = function(name)
{
    this.repository.off('room:close', this.goHome);
    this.repository.off('player:join', this.onJoin);
    this.repository.off('player:leave', this.applyScope);
    this.repository.off('player:ready', this.applyScope);
    this.repository.off('player:color', this.applyScope);
    this.repository.off('player:name', this.applyScope);
    this.repository.off('client:activity', this.applyScope);
    this.repository.off('room:master', this.onRoomMaster);
    this.repository.off('room:game:start', this.start);

    if (this.room) {
        for (var i = this.room.players.items.length - 1; i >= 0; i--) {
            this.room.players.items[i].off('control:change', this.onControlChange);
        }
    }
};

/**
 * Go back to the homepage
 */
RoomController.prototype.goHome = function()
{
    this.$location.path('/');
};

/**
 * Add player
 */
RoomController.prototype.addPlayer = function(name, color)
{
    var $scope = this.$scope;

    name  = typeof(name) !== 'undefined' ? name : $scope.username;
    color = typeof(color) !== 'undefined' ? color : null;

    if (name) {
        this.repository.addPlayer(
            name,
            color,
            function (result) {
                if (result.success) {
                    $scope.username = null;
                    $scope.$apply();
                } else {
                    var error = typeof(result.error) !== 'undefined' ? result.error : 'Unknown error';
                    console.error('Could not add player %s: %s', name, error);
                }
            }
        );
    }
};

/**
 * Remove player
 */
RoomController.prototype.removePlayer = function(player)
{
    if (!player.local) { return; }

    var controller = this;

    this.repository.removePlayer(
        player,
        function (result) {
            if (!result.success) {
                console.error('Could not remove player %s', player.name);
            }
        }
    );
};

/**
 * Kick player
 */
RoomController.prototype.kickPlayer = function(player)
{
    var repository  = this;

    this.repository.kickPlayer(player, function (result) {
        if (!result.success) {
            console.error('Could not kick player %s', player.name);
        }
        repository.applyScope();
    });
};

/**
 * On join
 *
 * @param {Event} e
 */
RoomController.prototype.onJoin = function(e)
{
    var player = e.detail.player;

    if (player.client.id === this.client.id) {
        player.on('control:change', this.onControlChange);
        player.setLocal(true);

        player.profile = this.profile.name === player.name;

        this.updateCurrentMessage();

        if (player.profile) {
            this.setProfileControls(player);
        }

        if (this.useTouch) {
            player.setTouch();
        }
    } else {
        this.notifier.notify('New player joined!');
    }

    this.applyScope();
};

/**
 * Set player color
 *
 * @return {Array}
 */
RoomController.prototype.setColor = function(player)
{
    if (!player.local) { return; }

    var controller = this;

    this.repository.setColor(
        player.id,
        player.color,
        function (result) {
            if (!result.success) {
                console.error('Could not set color %s for player %s', player.color, player.name);
                player.color = result.color;
            } else if (player.profile) {
                controller.profile.setColor(player.color);
            }

            controller.applyScope();
        }
    );
};

/**
 * Set player name
 *
 * @return {Array}
 */
RoomController.prototype.setName = function(player)
{
    if (!player.local) { return; }

    var controller = this;

    this.repository.setName(
        player.id,
        player.name,
        function (result) {
            if (!result.success) {
                var error = typeof(result.error) !== 'undefined' ? result.error : 'Unknown error',
                    name = typeof(result.name) !== 'undefined' ? result.name : null;

                console.error('Could not rename player: %s', error);

                if (name) {
                    player.name = name;
                }
            }

            if (player.profile) {
                controller.profile.setName(player.name);
            }

            controller.applyScope();
        }
    );
};

/**
 * Set player ready
 *
 * @return {Array}
 */
RoomController.prototype.setReady = function(player)
{
    if (!player.local) { return; }

    this.repository.setReady(
        player.id,
        function (result) {
            if (!result.success) {
                console.error('Could not set player %s ready', player.name);
            }
        }
    );
};

/**
 * Set touch
 *
 * @param {Player} player
 */
RoomController.prototype.setTouch = function(player)
{
    if (!this.hasTouch) { return; }

    this.useTouch = true;

    var players = this.room.getLocalPlayers();

    for (var i = players.items.length - 1; i >= 0; i--) {
        players.items[i].setTouch();
    }
};

/**
 * Start Game
 *
 * @param {Event} e
 */
RoomController.prototype.start = function(e)
{
    this.$location.path(this.room.gameUrl);
    this.applyScope();
};

/**
 * Add profile user
 */
RoomController.prototype.addProfileUser = function()
{
    if (this.room.isNameAvailable(this.profile.name)) {
        this.profile.on('change', this.updateProfile);
        this.addPlayer(this.profile.name, this.profile.color);
    }
};

/**
 * Update profile
 */
RoomController.prototype.updateProfile = function()
{
    var player = this.room.players.match(function (player) { return this.profile; });

    if (player) {
        this.setProfileName(player);
        this.setProfileColor(player);
        this.setProfileControls(player);
    }
};

/**
 * Update current message
 */
RoomController.prototype.updateCurrentMessage = function()
{
    var profile = this.room.players.match(function (player) { return this.profile; }),
        player = this.room.players.match(function (player) { return this.local; });

    this.chat.setPlayer(profile ? profile : player);
};

/**
 * Triggered when a local player changes its controls
 *
 * @param {Event} e
 */
RoomController.prototype.onControlChange = function(e)
{
    this.saveProfileControls();
    this.applyScope();
};

/**
 * Save controls
 */
RoomController.prototype.saveProfileControls = function()
{
    var player = this.room.players.match(function (player) { return this.profile; });

    if (player && !this.controlSynchro) {
        this.controlSynchro = true;
        this.profile.setControls(player.getMapping());
        this.controlSynchro = false;
    }
};

/**
 * Set profile controls
 */
RoomController.prototype.setProfileControls = function(player)
{
    if (!this.controlSynchro) {
        this.controlSynchro = true;

        for (var i = this.profile.controls.length - 1; i >= 0; i--) {
            player.controls[i].loadMapping(this.profile.controls[i].getMapping());
        }

        this.controlSynchro = false;

        this.applyScope();
    }
};

/**
 * Set profile name
 */
RoomController.prototype.setProfileName = function(player)
{
    if (this.profile.name !== player.name) {
        player.setName(this.profile.name);
        this.setName(player);
    }
};

/**
 * Set profile color
 */
RoomController.prototype.setProfileColor = function(player)
{
    if (this.profile.color !== player.color) {
        player.setColor(this.profile.color);
        this.setColor(player);
    }
};

/**
 * Toggle parameters
 */
RoomController.prototype.onRoomMaster = function(e)
{
    this.$scope.master = this.repository.amIMaster();
    this.applyScope();
};

/**
 * Toggle parameters
 */
RoomController.prototype.toggleParameters = function()
{
    this.$scope.displayParameters = !this.$scope.displayParameters;
};

/**
 * Apply scope
 */
RoomController.prototype.applyScope = CurvytronController.prototype.applyScope;
