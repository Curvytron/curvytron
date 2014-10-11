/**
 * Player control
 */
function PlayerControl(value, icon)
{
    EventEmitter.call(this);

    this.icon      = icon;
    this.listening = false;

    this.keyboardMapper = new KeyboardMapper();
    this.touchMapper    = new TouchMapper();
    this.gamepadMapper  = new GamepadMapper(gamepadListener, true);

    this.mapper = this.keyboardMapper;

    this.start            = this.start.bind(this);
    this.stop             = this.stop.bind(this);
    this.onKeyboardChange = this.onKeyboardChange.bind(this);
    this.onGamepadChange  = this.onGamepadChange.bind(this);
    this.onTouchChange    = this.onTouchChange.bind(this);

    this.keyboardMapper.on('change', this.onKeyboardChange);
    this.gamepadMapper.on('change', this.onGamepadChange);
    this.touchMapper.on('change', this.onTouchChange);

    this.keyboardMapper.on('listening:stop', this.stop);
    this.gamepadMapper.on('listening:stop', this.stop);
    this.touchMapper.on('listening:stop', this.stop);

    this.mapper.setValue(value);
}

PlayerControl.prototype = Object.create(EventEmitter.prototype);
PlayerControl.prototype.constructor = PlayerControl;

/**
 * On change
 *
 * @param {Event} e
 */
PlayerControl.prototype.onKeyboardChange = function(e)
{
    this.mapper = this.keyboardMapper;
    this.emit('change');
};

/**
 * On change
 *
 * @param {Event} e
 */
PlayerControl.prototype.onGamepadChange = function(e)
{
    this.mapper = this.gamepadMapper;
    this.emit('change');
};

/**
 * On change
 *
 * @param {Event} e
 */
PlayerControl.prototype.onTouchChange = function(e)
{
    this.mapper = this.touchMapper;
    this.emit('change');
};

/**
 * Toggle
 */
PlayerControl.prototype.toggle = function()
{
    if (this.mapper.listening) {
        this.stop();
    } else {
        this.start();
    }
};

/**
 * Start listening
 */
PlayerControl.prototype.start = function()
{
    this.gamepadMapper.start();
    this.keyboardMapper.start();
    this.touchMapper.start();
};

/**
 * Start listening
 */
PlayerControl.prototype.stop = function()
{
    this.gamepadMapper.stop();
    this.keyboardMapper.stop();
    this.touchMapper.stop();
};