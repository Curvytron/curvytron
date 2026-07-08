import EventEmitter from 'tom32i-event-emitter.js';

function InputListener(mapper, input)
{
    EventEmitter.call(this);

    this.mapper  = mapper;
    this.element = typeof(input) === 'string' ? document.getElementById(input) : input;

    this.onMapperListening = this.onMapperListening.bind(this);
    this.onMapperChange    = this.onMapperChange.bind(this);

    this.element.addEventListener('focus', mapper.start);
    this.element.addEventListener('blur', mapper.stop);

    if (!(mapper instanceof KeyboardMapper)) {
        this.element.addEventListener('keyup', mapper.kill);
        this.element.addEventListener('keydown', mapper.kill);
        this.element.addEventListener('keypress', mapper.kill);
    }

    this.mapper.on('listening:start', this.onMapperListening);
    this.mapper.on('listening:stop', this.onMapperChange);
    this.mapper.on('change', this.onMapperChange);
}

InputListener.prototype = Object.create(EventEmitter.prototype);
InputListener.prototype.constructor = InputListener;

InputListener.prototype.onMapperListening = function()
{
    this.element.value       = '';
    this.element.placeholder = '...';
};

InputListener.prototype.onMapperChange = function()
{
    this.element.value       = this.mapper.view;
    this.element.placeholder = '';
    this.element.blur();
};

function Mapper()
{
    EventEmitter.call(this);

    this.value     = null;
    this.view      = null;
    this.listening = false;

    this.start = this.start.bind(this);
    this.stop  = this.stop.bind(this);
}

Mapper.prototype = Object.create(EventEmitter.prototype);
Mapper.prototype.constructor = Mapper;

Mapper.prototype.setValue = function(value)
{
    if (this.value !== value) {
        this.value = value;
        this.view  = this.guessChar(this.value);
        this.emit('change', {value: this.value, view: this.view});
    }
};

Mapper.prototype.start = function()
{
    if (!this.listening) {
        this.listening = true;
        this.emit('listening:start');
        return true;
    }
    return false;
};

Mapper.prototype.stop = function()
{
    if (this.listening) {
        this.listening = false;
        this.emit('listening:stop');
        return true;
    }
    return false;
};

Mapper.prototype.kill = function(e)
{
    e.preventDefault();
    return false;
};

Mapper.prototype.guessChar = function(key)
{
    return key.toString();
};

function KeyboardMapper()
{
    Mapper.call(this);
    this.onKey = this.onKey.bind(this);
}

KeyboardMapper.prototype = Object.create(Mapper.prototype);
KeyboardMapper.prototype.constructor = KeyboardMapper;

KeyboardMapper.prototype.start = function()
{
    if (Mapper.prototype.start.call(this)) {
        window.addEventListener('keydown', this.onKey);
        window.addEventListener('keypress', this.kill);
    }
};

KeyboardMapper.prototype.stop = function()
{
    if (Mapper.prototype.stop.call(this)) {
        window.removeEventListener('keydown', this.onKey);
        window.removeEventListener('keypress', this.kill);
    }
};

KeyboardMapper.prototype.onKey = function(e)
{
    e.preventDefault();
    this.stop();
    this.setValue(e.keyCode);
    return false;
};

KeyboardMapper.prototype.guessChar = function(key)
{
    key = key.toString();
    switch (key) {
        case '8':  return 'Backspace';
        case '13': return 'Enter';
        case '16': return 'Maj';
        case '17': return 'Ctrl';
        case '18': return 'Alt';
        case '32': return 'Space';
        case '38': return '↑';
        case '40': return '↓';
        case '39': return '→';
        case '37': return '←';
        default:   return String.fromCharCode(key);
    }
};

function GamepadMapper(listener, indexGamepad)
{
    Mapper.call(this);

    this.gamepadListener = listener;
    this.indexGamepad    = typeof(indexGamepad) !== 'undefined' && indexGamepad;

    this.onAxis   = this.onAxis.bind(this);
    this.onButton = this.onButton.bind(this);
}

GamepadMapper.prototype = Object.create(Mapper.prototype);
GamepadMapper.prototype.constructor = GamepadMapper;

GamepadMapper.prototype.sticks = {
    '0': {'-1': '←', '1': '→', '0': 'idle'},
    '1': {'-1': '↑', '1': '↓', '0': 'idle'}
};

GamepadMapper.prototype.start = function()
{
    if (Mapper.prototype.start.call(this)) {
        this.gamepadListener.on('gamepad:axis', this.onAxis);
        this.gamepadListener.on('gamepad:button', this.onButton);
    }
};

GamepadMapper.prototype.stop = function()
{
    if (Mapper.prototype.stop.call(this)) {
        this.gamepadListener.off('gamepad:axis', this.onAxis);
        this.gamepadListener.off('gamepad:button', this.onButton);
    }
};

GamepadMapper.prototype.onAxis = function(e)
{
    var value  = e.detail.value > 0 ? 1 : (e.detail.value < 0 ? -1 : 0),
        prefix = this.indexGamepad ? 'gamepad:' + e.detail.gamepad.index + ':' : '';
    this.setValue(prefix + 'axis:' + e.detail.axis + ':' + value);
    this.stop();
};

GamepadMapper.prototype.onButton = function(e)
{
    this.stop();
    var value  = e.detail.index,
        prefix = this.indexGamepad ? 'gamepad:' + e.detail.gamepad.index + ':' : '';
    this.setValue(prefix + 'button:' + value);
};

GamepadMapper.prototype.guessChar = function(key)
{
    var axis   = new RegExp('^(gamepad:\\d+:)?axis:(\\d+):(-?\\d+)$', 'gi').exec(key),
        button = new RegExp('^(gamepad:\\d+:)?button:(\\d+)$', 'gi').exec(key);
    if (axis)   { return 'Stick ' + this.sticks[axis[2]][axis[3]]; }
    if (button) { return 'Button (' + button[2] + ')'; }
    return key;
};

function TouchMapper()
{
    Mapper.call(this);
    this.onTouch = this.onTouch.bind(this);
}

TouchMapper.prototype = Object.create(Mapper.prototype);
TouchMapper.prototype.constructor = TouchMapper;

TouchMapper.prototype.start = function()
{
    if (Mapper.prototype.start.call(this)) {
        window.addEventListener('touchstart', this.onTouch);
        window.addEventListener('touchend', this.kill);
        window.addEventListener('touchcancel', this.kill);
        window.addEventListener('touchleave', this.kill);
    }
};

TouchMapper.prototype.stop = function()
{
    if (Mapper.prototype.stop.call(this)) {
        window.removeEventListener('touchstart', this.onTouch);
        window.removeEventListener('touchend', this.kill);
        window.removeEventListener('touchcancel', this.kill);
        window.removeEventListener('touchleave', this.kill);
    }
};

TouchMapper.prototype.onTouch = function(e)
{
    e.preventDefault();
    this.stop();
    this.setValue(e.changedTouches[0]);
    return false;
};

TouchMapper.prototype.guessChar = function()
{
    return '✍';
};

export { InputListener, Mapper, KeyboardMapper, GamepadMapper, TouchMapper };
