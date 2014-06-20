/**
 * Player control
 */
function PlayerControl(value, icon)
{
    EventEmitter.call(this);

    this.icon      = icon;
    this.listening = false;

    this.keyboardMapper = new KeyboardMapper();
    this.gamepadMapper  = new GamepadMapper(gamepadListener, true);

    this.mapper = this.keyboardMapper;

    this.start            = this.start.bind(this);
    this.stop             = this.stop.bind(this);
    this.onKeyboardChange = this.onKeyboardChange.bind(this);
    this.onGamepadChange  = this.onGamepadChange.bind(this);

    this.keyboardMapper.on('change', this.onKeyboardChange);
    this.gamepadMapper.on('change', this.onGamepadChange);
    this.keyboardMapper.on('listening:stop', this.stop);
    this.gamepadMapper.on('listening:stop', this.stop);

    this.mapper.setValue(value);
}

PlayerControl.prototype = Object.create(EventEmitter.prototype);

/**
 * On change
 *
 * @param {Event} e
 */
PlayerControl.prototype.onKeyboardChange = function(e)
{
    console.log('onKeyboardChange', e);
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
    console.log('onGamepadChange', e);
    this.mapper = this.gamepadMapper;
    this.emit('change');
};

/**
 * Start listening
 */
PlayerControl.prototype.start = function()
{
    this.gamepadMapper.start();
    this.keyboardMapper.start();
};

/**
 * Start listening
 */
PlayerControl.prototype.stop = function()
{
    this.gamepadMapper.stop();
    this.keyboardMapper.stop();
};