/**
 * BasePlayer
 *
 * @param {String} name
 * @param {String} color
 */
function BasePlayer(name, color)
{
    EventEmitter.call(this);

    this.name   = name;
    this.color  = typeof(color) !== 'undefined' ? color : 'red';
    this.avatar = 'test.png';
}

BasePlayer.prototype = Object.create(EventEmitter.prototype);

/**
 * Serialize
 *
 * @return {Object}
 */
BasePlayer.prototype.serialize = function()
{
    return {
        name: this.name,
        color: this.color
    };
};