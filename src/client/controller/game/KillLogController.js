/**
 * Kill Log Controller
 *
 * @param {Object} $scope
 * @param {Object} $interpolate
 * @param {SocketClient} client
 */
function KillLogController($scope, $interpolate, client)
{
    if (!$scope.game) { return; }

    this.$scope    = $scope;
    this.client    = client;
    this.game      = $scope.game;
    this.element   = document.getElementById('kill-log-feed');
    this.logs      = [];
    this.templates = {
        suicide: $interpolate('<span style="color: {{ ::deadPlayer.color }}">{{ ::deadPlayer.name }}</span> committed suicide'),
        kill: $interpolate('<span style="color: {{ ::deadPlayer.color }}">{{ ::deadPlayer.name }}</span> was killed by <span style="color: {{ ::killerPlayer.color }}">{{ ::killerPlayer.name }}</span>'),
        crash: $interpolate('<span style="color: {{ ::deadPlayer.color }}">{{ ::deadPlayer.name }}</span> crashed on <span style="color: {{ ::killerPlayer.color }}">{{ ::killerPlayer.name }}</span>'),
        wall: $interpolate('<span style="color: {{ ::deadPlayer.color }}">{{ ::deadPlayer.name }}</span> crashed on the wall')
    };

    this.clear       = this.clear.bind(this);
    this.onDie       = this.onDie.bind(this);
    this.applyScope  = this.applyScope.bind(this);
    this.digestScope = this.digestScope.bind(this);

    this.$scope.onLoaded = this.onLoaded;

    this.client.on('die', this.onDie);
    this.client.on('round:new', this.clear);
}

/**
 * Message display duration
 *
 * @type {Number}
 */
KillLogController.prototype.display = 5000;

/**
 * Maximum number of logs
 *
 * @type {Number}
 */
KillLogController.prototype.maxLogs = 5;

/**
 * On die
 *
 * @param {Event} e
 */
KillLogController.prototype.onDie = function(e)
{
    var data   = e.detail,
        avatar = this.game.avatars.getById(data[0]);

    if (avatar) {
        var killer = data[1] ? this.game.avatars.getById(data[1]) : null;
        this.add(new MessageDie(avatar, killer, data[2]));
    }
};

/**
 * Get element
 *
 * @param {Message} message
 *
 * @return {Element}
 */
KillLogController.prototype.getElement = function(message) {
    var element = document.createElement('div');

    element.className = 'one-message';
    element.innerHTML = '<span class="message-icon icon-dead"></span>' + this.templates[message.type](message);

    return element;
};

/**
 * Kill log
 *
 * @param {MessageDie} message
 */
KillLogController.prototype.add = function(message)
{
    var controller = this,
        element    = this.getElement(message);

    this.logs.push(element);

    setTimeout(function () { controller.remove(element); }, this.display);

    if (this.logs.length > this.maxLogs) {
        for (var i = this.logs.length - this.maxLogs; i >= 0; i--) {
            this.remove(this.logs[0]);
        }
    }

    this.element.appendChild(element);
};

/**
 * Remove message
 *
 * @param {Element} element
 */
KillLogController.prototype.remove = function (element)
{
    var index = this.logs.indexOf(element);

    if (index >= 0) {
        element.parentNode.removeChild(element);
        this.logs.splice(index, 1);
    }
};

/**
 * Clear
 */
KillLogController.prototype.clear = function()
{
    this.logs.length       = 0;
    this.element.innerHTML = '';
};

/**
 * Apply scope
 */
KillLogController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
KillLogController.prototype.digestScope = CurvytronController.prototype.digestScope;
