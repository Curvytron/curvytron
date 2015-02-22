/**
 * Notifier
 *
 * @param {SoundManager} SoundManager
 */
function Notifier (sound)
{
    this.sound   = sound;
    this.element = document.getElementsByTagName('title')[0];
    this.title   = this.element.text;
    this.timeout = null;

    this.clear = this.clear.bind(this);
}

/**
 * Default message duration
 *
 * @type {Number}
 */
Notifier.prototype.duration = 5000;

/**
 * Set message
 *
 * @param {String} message
 * @param {Number} duration
 */
Notifier.prototype.addMessage = function(message, duration, sound)
{
    this.clearTimeout();
    this.write(message);
    setTimeout(this.clear, typeof(duration) === 'number' ? duration : this.duration);

    if (typeof(sound) !== 'undefined' && sound) {
        this.sound.play(typeof(sound) === 'string' ? sound : 'notice');
    }
};

/**
 * Write a message in the title
 *
 * @param {String} message
 */
Notifier.prototype.write = function(message)
{
    this.element.text = message + ' - ' + this.title;
};

/**
 * Clear the title
 */
Notifier.prototype.clear = function()
{
    this.clearTimeout();
    this.element.text = this.title;
};

/**
 * Clear timeout
 */
Notifier.prototype.clearTimeout = function()
{
    if (this.timeout) {
        clearTimeout(this.timeout);
    }
};
