/**
 * Player control
 */
function PlayerControl(value, icon)
{
    EventEmitter.call(this);

    this.icon      = icon;
    this.listening = false;
    this.mappers   = new Collection();

    this.start = this.start.bind(this);
    this.stop  = this.stop.bind(this);

    this.addMapper('keyboard', new KeyboardMapper());
    this.addMapper('touch', new TouchMapper());
    this.addMapper('gamepad', new GamepadMapper(gamepadListener, true));

    this.mapper = this.mappers.getById('keyboard');

    this.mapper.setValue(value);
}

PlayerControl.prototype = Object.create(EventEmitter.prototype);
PlayerControl.prototype.constructor = PlayerControl;

/**
 * Create mapper
 *
 * @param {String} id
 * @param {Mapper} mapper
 */
PlayerControl.prototype.addMapper = function(id, mapper)
{
    var control = this;

    mapper.id = id;

    mapper.on('change', function (e) { return control.setMapper(mapper); });
    mapper.on('listening:stop', this.stop);

    this.mappers.add(mapper);
};

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
        'mapper': this.mapper.id,
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
    var mapper = this.mappers.getById(mapping.mapper);

    if (mapper) {
        this.setMapper(mapper);
        this.mapper.setValue(mapping.value);
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
    for (var i = this.mappers.items.length - 1; i >= 0; i--) {
        this.mappers.items[i].start();
    }
};

/**
 * Start listening
 */
PlayerControl.prototype.stop = function()
{
    for (var i = this.mappers.items.length - 1; i >= 0; i--) {
        this.mappers.items[i].stop();
    }
};
