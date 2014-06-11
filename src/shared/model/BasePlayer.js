/**
 * BasePlayer
 *
 * @param {String} name
 * @param {String} color
 */
function BasePlayer(name, color, mail)
{
    EventEmitter.call(this);

    this.name   = name;
    this.color  = typeof(color) !== 'undefined' ? color : 'red';
    this.mail   = mail;
    this.ready  = false;
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
        color: this.color,
        mail: this.mail,
        ready: this.ready
    };
};