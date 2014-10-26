/**
 * Player control
 */
function PlayerControl(value, icon)
{
    EventEmitter.call(this);

    this.icon      = icon;
    this.listening = false;
    this.mappers   = [
        new KeyboardMapper(),
        new TouchMapper(),
        new GamepadMapper(gamepadListener, true)
    ];

    this.start = this.start.bind(this);
    this.stop  = this.stop.bind(this);

    var control = this,
        mapper, i;

    for (i = this.mappers.length - 1; i >= 0; i--) {
        mapper = this.mappers[i];
        this.mappers[i].on('change', function (e) { return control.setMapper(mapper); });
        this.mappers[i].on('listening:stop', this.stop);
    }

    this.mapper = this.mappers[0];

    this.mapper.setValue(value);
}

PlayerControl.prototype = Object.create(EventEmitter.prototype);
PlayerControl.prototype.constructor = PlayerControl;

/**
 * Set mapper
 *
 * @param {Mapper} mapper
 */
PlayerControl.prototype.setMapper = function(mapper)
{
    this.mapper = mapper;
    this.emit('change');
};

/**
 * Get mapping
 *
 * @return {Object}
 */
PlayerControl.prototype.getMapping = function()
{
    return {
        'mapper': this.mapper.constructor.name,
        'value': this.mapper.value
    };
};

/**
 * Load mapping
 *
 * @param {Object} mapping
 */
PlayerControl.prototype.loadMapping = function(mapping)
{
    for (var i = this.mappers.length - 1; i >= 0; i--) {
        if (this.mappers[i].constructor.name === mapping.mapper) {
            this.setMapper(this.mappers[i]);
            this.mapper.setValue(mapping.value);
        }
    }
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
    for (var i = this.mappers.length - 1; i >= 0; i--) {
        this.mappers[i].start();
    }
};

/**
 * Start listening
 */
PlayerControl.prototype.stop = function()
{
    for (var i = this.mappers.length - 1; i >= 0; i--) {
        this.mappers[i].stop();
    }
};
