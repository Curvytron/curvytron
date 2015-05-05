/**
 * Player
 *
 * @param {Number} id
 * @param {String} client
 * @param {String} name
 * @param {String} color
 * @param {Boolean} ready
 */
function Player(id, client, name, color, ready)
{
    BasePlayer.call(this, client, name, color, ready);

    this.id       = id;
    this.local    = false;
    this.controls = null;
    this.vote     = false;
    this.kicked   = false;
    this.position = this.client.id + '-' + this.id;

    this.onControlChange = this.onControlChange.bind(this);

    this.client.players.add(this);
}

Player.prototype = Object.create(BasePlayer.prototype);
Player.prototype.constructor = Player;

/**
 * Set local
 *
 * @param {Boolean} local
 */
Player.prototype.setLocal = function(local)
{
    this.local = local;

    this.initControls();
};

/**
 * Init controls
 */
Player.prototype.initControls = function()
{
    if (!this.controls) {
        this.controls = [
            new PlayerControl(37, 'icon-left-dir'),
            new PlayerControl(39, 'icon-right-dir')
        ];

        for (var i = this.controls.length - 1; i >= 0; i--) {
            this.controls[i].on('change', this.onControlChange);
        }
    }
};

/**
 * Get controls mapping
 *
 * @return {Array}
 */
Player.prototype.getMapping = function()
{
    var mapping = new Array(this.controls.length);

    for (var i = this.controls.length - 1; i >= 0; i--) {
        mapping[i] = this.controls[i].getMapping();
    }

    return mapping;
};

/**
 * Set touch
 */
Player.prototype.setTouch = function()
{
    var touch = document.createTouch(window, window, new Date().getTime(), 0, 0, 0, 0);

    for (var i = this.controls.length - 1; i >= 0; i--) {
        this.controls[i].mappers.getById('touch').setValue(touch);
    }
};

/**
 * On change
 *
 * @param {Event} e
 */
Player.prototype.onControlChange = function(e)
{
    this.emit('control:change');
};

/**
 * Get binding
 *
 * @return {Array}
 */
Player.prototype.getBinding = function()
{
    return [this.controls[0].mapper.value, this.controls[1].mapper.value];
};

/**
 * Should this player be considered master?
 *
 * @return {Boolean}
 */
Player.prototype.isMaster = function ()
{
    return this.client.master && this.client.players.getIdIndex(this.id) === 0;
};
