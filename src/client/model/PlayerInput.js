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
    this.binding = typeof(binding) !== 'undefined' ? binding : this.defaultBinding;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp   = this.onKeyUp.bind(this);
    this.onAxis    = this.onAxis.bind(this);
    this.onButton  = this.onButton.bind(this);

    this.attachEvents();
}

PlayerInput.prototype = Object.create(EventEmitter.prototype);
PlayerInput.prototype.constructor = PlayerInput;

/**
 * Key binding
 *
 * @type {Object}
 */
PlayerInput.prototype.defaultBinding = [37, 39];

/**
 * Attach events
 */
PlayerInput.prototype.attachEvents = function()
{
    var listening = [],
        binding, type;

    for (var i = this.binding.length - 1; i >= 0; i--) {
        binding = this.binding[i];
        type = this.getBindingType(binding);

        if (listening.indexOf(type) < 0) {
            listening.push(type);

            if (type === 'keyboard') {
                window.addEventListener('keydown', this.onKeyDown);
                window.addEventListener('keyup', this.onKeyUp);
            } else if (new RegExp('^gamepad:\\d+:button').test(type)) {
                gamepadListener.on(type, this.onButton);
            } else {
                gamepadListener.on(type, this.onAxis);
            }
        }
    }
};

/**
 * Detach events
 */
PlayerInput.prototype.detachEvents = function()
{
    var listening = [],
        binding, type;

    for (var i = this.binding.length - 1; i >= 0; i--) {
        binding = this.binding[i];
        type = this.getBindingType(binding);

        if (listening.indexOf(type) < 0) {
            listening.push(type);

            if (type === 'keyboard') {
                window.removeEventListener('keydown', this.onKeyDown);
                window.removeEventListener('keyup', this.onKeyUp);
            } else if (new RegExp('^gamepad:\\d+:button').test(type)) {
                gamepadListener.off(type, this.onButton);
            } else {
                gamepadListener.off(type, this.onAxis);
            }
        }
    }
};

/**
 * Get binding type
 *
 * @param {String} binding
 *
 * @return {String}
 */
PlayerInput.prototype.getBindingType = function(binding)
{
    var matches = new RegExp('^(gamepad:(\\d+):(button|axis):(\\d+))').exec(binding);

    return matches ? matches[1] : 'keyboard';
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
    var index = this.binding.indexOf('gamepad:' + e.detail.gamepad.index + ':axis:' + e.detail.axis + ':' + e.detail.value);

    if (index >= 0) {
        this.setActive(index, true);
    } else {
        for (var i = this.binding.length - 1; i >= 0; i--) {
            if (new RegExp('^gamepad:' + e.detail.gamepad.index + ':axis:' + e.detail.axis).test(this.binding[i])) {
                this.setActive(i, false);
            }
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