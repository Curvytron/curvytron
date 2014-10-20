/**
 * Remembered profile
 */
function Profile()
{
    EventEmitter.call(this);

    this.name     = null;
    this.color    = null;
    this.controls = [
        new PlayerControl(37, 'icon-left-dir'),
        new PlayerControl(39, 'icon-right-dir')
    ];

    // Binding
    this.onControlChange = this.onControlChange.bind(this);

    var labels = ['Left', 'Right'];

    for (var i = this.controls.length - 1; i >= 0; i--) {
        this.controls[i].label = labels[i];
        this.controls[i].on('change', this.onControlChange);
    }

    this.load();
    this.persist();
}

Profile.prototype = Object.create(EventEmitter.prototype);
Profile.prototype.constructor = Profile;

/**
 * Local storage key
 *
 * @type {String}
 */
Profile.prototype.localKey = 'PROFILE';

/**
 * Get data
 *
 * @return {Object}
 */
Profile.prototype.serialize = function()
{
    return {
        name: this.name,
        color: this.color,
        controls: this.getMapping()
    };
};

/**
 * Unserialize
 *
 * @param {Object} data
 */
Profile.prototype.unserialize = function(data)
{
    if (typeof(data.name) !== 'undefined') {
        this.setName(data.name);
    }

    if (typeof(data.color) !== 'undefined') {
        this.setColor(data.color);
    }

    if (typeof(data.controls) !== 'undefined') {
        this.setControls(data.controls);
    }
};

/**
 * Persist
 */
Profile.prototype.persist = function()
{
    if (this.name) {
        window.localStorage.setItem(this.localKey, JSON.stringify(this.serialize()));
    }
};

/**
 * Persist
 */
Profile.prototype.load = function()
{
    var data = window.localStorage.getItem(this.localKey);

    if (data) {
        this.unserialize(JSON.parse(data));
        this.emit('change');
    }
};

/**
 * Get mapping
 *
 * @return {Array}
 */
Profile.prototype.getMapping = function()
{
    var mapping = new Array(this.controls.length);

    for (var i = this.controls.length - 1; i >= 0; i--) {
        mapping[i] = this.controls[i].getMapping();
    }

    return mapping;
};

/**
 * Set name
 *
 * @param {Name} name
 */
Profile.prototype.setName = function(name)
{
    if (this.name !== name) {
        this.name = name;
        this.persist();
    }
};

/**
 * Set color
 *
 * @param {Name} color
 */
Profile.prototype.setColor = function(color)
{
    if (this.color !== color) {
        this.color = color;
        this.persist();
    }
};

/**
 * Set controls
 *
 * @param {Object} controls
 */
Profile.prototype.setControls = function(controls)
{
    for (var i = controls.length - 1; i >= 0; i--) {
        this.controls[i].loadMapping(controls[i]);
    }
    this.persist();
};

/**
 *
 * Profile
 *
 * @param {Event} e
 */
Profile.prototype.onControlChange = function(e)
{
    this.persist();
    this.emit('change');
};

/**
 * Is profile complete?
 *
 * @return {Boolean}
 */
Profile.prototype.isComplete = function()
{
    return this.name && this.color ? true : false;
};