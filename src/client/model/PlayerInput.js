/**
 * Player input
 */
function PlayerInput(avatar, binding)
{
    EventEmitter.call(this);

    this.avatar  = avatar;
    this.key     = false;
    this.active  = [false, false];
    this.move    = 0;
    this.binding = typeof(binding) != 'undefined' ? binding : this.defaultBinding;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp   = this.onKeyUp.bind(this);
    this.onAxis    = this.onAxis.bind(this);
    this.onButton  = this.onButton.bind(this);

    var types = [
        this.getBindingType(this.binding[0]),
        this.getBindingType(this.binding[1])
    ];

    console.log(this.binding, types);

    if (types.indexOf('axis') >= 0) {
        gamepadListener.on('gamepad:axis', this.onAxis);
        this.gamepadRegex = new RegExp('^gamepad:\\d+:axis:(\\d+):(-?\\d+)');
    }

    if (types.indexOf('button') >= 0) {
        gamepadListener.on('gamepad:button', this.onButton);
    }

    if (types.indexOf('keyboard') >= 0) {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

}

PlayerInput.prototype = Object.create(EventEmitter.prototype);

/**
 * Key binding
 *
 * @type {Object}
 */
PlayerInput.prototype.defaultBinding = [37, 39];

/**
 * Get binding type
 *
 * @param {String} binding
 *
 * @return {String}
 */
PlayerInput.prototype.getBindingType = function(binding)
{
    if (new RegExp('^gamepad:').test(binding)) {
        return new RegExp('^gamepad:\\d+:button').test(binding) ? 'button' : 'axis';
    }

    return 'keyboard';
};

/**
 * On Key Down
 *
 * @param {Event} e
 */
PlayerInput.prototype.onKeyDown = function(e)
{
    var index = this.binding.indexOf(e.keyCode);

    if (index >= 0) {
        this.setActive(index, true);
    }
};

/**
 * On Key Down
 *
 * @param {Event} e
 */
PlayerInput.prototype.onKeyUp = function(e)
{
    var index = this.binding.indexOf(e.keyCode);

    if (index >= 0) {
        this.setActive(index, false);
    }
};

/**
 * On axis
 *
 * @param {Event} e
 */
PlayerInput.prototype.onAxis = function(e)
{
    var axis;

    for (var i = this.binding.length - 1; i >= 0; i--) {
        axis = this.gamepadRegex.exec(this.binding[i]);
        if (axis && e.detail.axis == axis[1]) {
            this.setActive(i, e.detail.value == axis[2]);
        }
    }
};

/**
 * On button
 *
 * @param {Event} e
 */
PlayerInput.prototype.onButton = function(e)
{
    var index = this.binding.indexOf('gamepad:' + e.detail.gamepad.index + ':button:' + e.detail.index);

    if (index >= 0) {
        this.setActive(index, e.detail.pressed);
    }
};

/**
 * Resolve
 *
 * @param {Number} index
 * @param {Boolean} pressed
 */
PlayerInput.prototype.setActive = function(index, pressed)
{
    this.active[index] = pressed;
    this.resolve();
};

/**
 * Resolve
 */
PlayerInput.prototype.resolve = function()
{
    var move = (this.active[0] !== this.active[1]) ? (this.active[0] ? -1 : 1) : false;

    if (this.move !== move) {
        this.setMove(move);
    }
};

/**
 * Set move
 *
 * @param {Boolean} move
 */
PlayerInput.prototype.setMove = function(move)
{
    this.move = move;

    this.emit('move', {avatar: this.avatar, move: move});
};