/**
 * Room Controller
 *
 * @param {Object} $scope
 * @param {Object} $rootScope
 * @param {Object} $routeParams
 * @param {Object} $location
 * @param {RoomRepository} RoomRepository
 * @param {SocketClient} SocketClient
 * @param {Profuile} profile
 * @param {Chat} chat
 */
function RoomController($scope, $rootScope, $routeParams, $location, repository, client, profile, chat)
{
    this.$scope     = $scope;
    this.$rootScope = $rootScope;
    this.$location  = $location;
    this.repository = repository;
    this.client     = client;
    this.profile    = profile;
    this.chat       = chat;
    this.hasTouch   = typeof(window.ontouchstart) !== 'undefined';

    // Binding:
    this.addPlayer      = this.addPlayer.bind(this);
    this.addProfileUser = this.addProfileUser.bind(this);
    this.removePlayer   = this.removePlayer.bind(this);
    this.applyScope     = this.applyScope.bind(this);
    this.onJoin         = this.onJoin.bind(this);
    this.onJoined       = this.onJoined.bind(this);
    this.joinRoom       = this.joinRoom.bind(this);
    this.leaveRoom      = this.leaveRoom.bind(this);
    this.setColor       = this.setColor.bind(this);
    this.setReady       = this.setReady.bind(this);
    this.setName        = this.setName.bind(this);
    this.start          = this.start.bind(this);

    this.$scope.$on('$destroy', this.leaveRoom);

    // Hydrating scope:
    this.$scope.submitAddPlayer     = this.addPlayer;
    this.$scope.removePlayer        = this.removePlayer;
    this.$scope.setColor            = this.setColor;
    this.$scope.setReady            = this.setReady;
    this.$scope.setName             = this.setName;
    this.$scope.nameMaxLength       = Player.prototype.maxLength;
    this.$scope.colorMaxLength      = Player.prototype.colorMaxLength;
    this.$scope.curvytron.bodyClass = null;

    this.chat.setScope(this.$scope);

    var name = decodeURIComponent($routeParams.name);

    if (this.repository.synced) {
        this.joinRoom(name);
    } else {
        var controller = this;
        this.repository.on('synced', function () { controller.joinRoom(name); });
    }
}

/**
 * Tips
 *
 * @type {Array}
 */
RoomController.prototype.tips = [
    'To customize your left/right controls, click the [←]/[→] buttons and press any key.',
    'Curvytron supports gamepads! Connect it, press A, then setup your controls.',
    'Yes, you can play Curvytron on your smartphone ;)',
    'You can add multiple players on the same computer.',
    'Green bonuses apply only to you.',
    'Red bonuses target your ennemies.',
    'White bonuses affect everyone.',
    'Making a Snail™ is a sure way to win, but other players might hate you for it.',
    'The Enrichment Center regrets to inform you that this next test is impossible. Make no attempt to solve it.'
];

/**
 * Join room and load scope
 */
RoomController.prototype.joinRoom = function(name)
{
    this.repository.join(name, this.onJoined);
};

/**
 * On room joined
 *
 * @param {Object} result
 */
RoomController.prototype.onJoined = function(result)
{
    if (result.success) {
        this.room = this.repository.get(result.room);

        this.$scope.room = this.room;

        this.attachEvents(this.room.name);
        this.updateCurrentMessage();
        this.addTip();
        this.addProfileUser();

        setTimeout(this.chat.scrollDown, 0);
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
    this.repository.on('room:close:' + name, this.goHome);
    this.repository.on('room:join:' + name, this.onJoin);
    this.repository.on('room:leave:' + name, this.applyScope);
    this.repository.on('room:player:ready:' + name, this.applyScope);
    this.repository.on('room:player:color:' + name, this.applyScope);
    this.repository.on('room:player:name:' + name, this.applyScope);
    this.repository.on('room:game:start:' + name, this.start);

    for (var i = this.room.players.items.length - 1; i >= 0; i--) {
        this.room.players.items[i].on('control:change', this.applyScope);
    }
};

/**
 * Attach Events
 *
 * @param {String} name
 */
RoomController.prototype.detachEvents = function(name)
{
    this.repository.off('room:close:' + name, this.goHome);
    this.repository.off('room:join:' + name, this.onJoin);
    this.repository.off('room:leave:' + name, this.applyScope);
    this.repository.off('room:player:ready:' + name, this.applyScope);
    this.repository.off('room:player:color:' + name, this.applyScope);
    this.repository.off('room:player:name:' + name, this.applyScope);
    this.repository.off('room:game:start:' + name, this.start);

    if (this.room) {
        for (var i = this.room.players.items.length - 1; i >= 0; i--) {
            this.room.players.items[i].off('control:change', this.applyScope);
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
RoomController.prototype.addPlayer = function(name, color, callback)
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
                    console.error('Could not add player %s', $scope.username);
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
    if (!player.local) {
        return;
    }

    var controller = this;

    this.repository.removePlayer(
        player.id,
        function (result) {
            if (!result.success) {
                console.error('Could not remove player %s', player.name);
            }
        }
    );
};

/**
 * On join
 *
 * @param {Event} e
 */
RoomController.prototype.onJoin = function(e)
{
    var player = e.detail.player;

    if (player.client === this.client.id) {
        player.setLocal(true);
        player.on('control:change', this.applyScope);
        this.updateCurrentMessage();
        this.setProfileControls(player);

        if (this.hasTouch) {
            player.setTouch();
        }
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
                controller.applyScope();
            }
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
    if (!player.local) {
        return;
    }

    var controller = this;

    this.repository.setName(
        player.id,
        player.name,
        function (result) {
            if (!result.success) {
                console.error('Could not rename player %s to %s', result.name, player.name);
                player.name = result.name;
                controller.applyScope();
            }
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
    if (!player.local) {
        return;
    }

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
 * Start Game
 *
 * @param {Event} e
 */
RoomController.prototype.start = function(e)
{
    var player = this.room.getLocalPlayers().getFirst();

    if (player) {
        this.profile.setName(player.name);
        this.profile.setColor(player.color);
    }

    this.repository.stop();
    this.$location.path(this.room.gameUrl);
    this.applyScope();
};

/**
 * Add profile user
 */
RoomController.prototype.addProfileUser = function()
{
    this.addPlayer(this.profile.name, this.profile.color);
};

/**
 * Set profile controls
 */
RoomController.prototype.setProfileControls = function(player)
{
    if (player.name === this.profile.name) {
        for (var i = this.profile.controls.length - 1; i >= 0; i--) {
            player.controls[i].loadMapping(this.profile.controls[i].getMapping());
        }
        this.applyScope();
    }
};

/**
 * Update current message
 */
RoomController.prototype.updateCurrentMessage = function()
{
    this.chat.setRoom(this.room);
    this.chat.setPlayer(this.room.getLocalPlayers().getFirst());
};

/**
 * Add tutorial messages
 */
RoomController.prototype.addTip = function()
{
    this.chat.messages.push(new Message(
        {name: 'Tips', color: '#ff8069'},
        this.tips[Math.floor(Math.random() * this.tips.length)]
    ));
};

/**
 * Apply scope
 */
RoomController.prototype.applyScope = function()
{
    try {
        this.$scope.$apply();
    } catch (e) {

    }
};
