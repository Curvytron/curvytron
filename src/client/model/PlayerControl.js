/**
 * Player control
 */
function PlayerControl(value, icon)
{
    EventEmitter.call(this);

    this.icon   = icon;
    this.mapper = new KeyboardMapper();

    this.mapper.setValue(value);

    this.onChange = this.onChange.bind(this);

    this.mapper.on('change', this.onChange);
    this.mapper.on('listening:start', this.onChange);
    this.mapper.on('listening:stop', this.onChange);
}

PlayerControl.prototype = Object.create(EventEmitter.prototype);

/**
 * On change
 *
 * @param {Event} e
 */
PlayerControl.prototype.onChange = function(e)
{
    this.emit('change');
};