/**
 * Player
 *
 * @param {Number} id
 * @param {String} client
 * @param {String} name
 * @param {String} color
 */
function Player(id, client, name, color, mail)
{
    BasePlayer.call(this, client, name, color, mail);

    this.id       = id;
    this.local    = false;
    this.controls = null;

    this.onControlChange = this.onControlChange.bind(this);
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