/**
 * Remembered profile
 */
function Profile()
{
    EventEmitter.call(this);

    this.name     = null;
    this.color    = null;
    this.sound    = true;
    this.radio    = false;
    this.loading  = false;
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
        sound: this.sound,
        radio: this.radio,
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

    if (typeof(data.sound) !== 'undefined') {
        this.setSound(data.sound);
    }

    if (typeof(data.radio) !== 'undefined') {
        this.setRadio(data.radio);
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
    if (this.loading) { return; }

    if (this.isValid()) {
        window.localStorage.setItem(this.localKey, JSON.stringify(this.serialize()));
        this.emit('change');
    } else {
        this.load();
    }
};

/**
 * Persist
 */
Profile.prototype.load = function()
{
    this.loading = true;

    var data = window.localStorage.getItem(this.localKey);

    if (data) {
        this.unserialize(JSON.parse(data));
        this.emit('change');
    }

    if (!this.color) {
        this.setColor(BasePlayer.prototype.getRandomColor());
    }

    this.loading = false;
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
    name = name.trim();

    if (name.length && this.name !== name) {
        this.name = name;
        this.persist();
    }
};

/**
 * Set color
 *
 * @param {String} color
 */
Profile.prototype.setColor = function(color)
{
    if (BasePlayer.prototype.validateColor(color)) {
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
 * Set sound
 *
 * @param {Boolean} sound
 */
Profile.prototype.setSound = function(sound)
{
    if (this.sound !== sound) {
        this.sound = sound;
        this.persist();
    }
};

/**
 * Set radio
 *
 * @param {Boolean} radio
 */
Profile.prototype.setRadio = function(radio)
{
    if (this.radio !== radio) {
        this.radio = radio;
        this.persist();
    }
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
};

/**
 * Is profile complete?
 *
 * @return {Boolean}
 */
Profile.prototype.isComplete = function()
{
    return this.name && this.color;
};

/**
 * Is profile valid?
 *
 * @return {Boolean}
 */
Profile.prototype.isValid = function()
{
    if (!this.name || !this.name.trim().length) { return false; }
    if (!this.color || !BasePlayer.prototype.validateColor(this.color)) { return false; }

    return true;
};
