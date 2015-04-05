/**
 * Notifier
 *
 * @param {SoundManager} SoundManager
 * @param {ActivityWatcher} watcher
 */
function Notifier (sound, watcher)
{
    this.sound   = sound;
    this.watcher = watcher;
    this.element = document.getElementsByTagName('title')[0];
    this.title   = this.element.text;
    this.timeout = null;

    this.clear   = this.clear.bind(this);
}

/**
 * Default message duration
 *
 * @type {Number}
 */
Notifier.prototype.duration = 5000;

/**
 * Notify
 *
 * @param {String} message
 * @param {Number} duration
 * @param {String} sound
 */
Notifier.prototype.notify = function(message, duration, sound)
{
    if (!this.watcher.isActive() || !this.watcher.isFocused()) {
        this.display(message, duration);
    }

    this.sound.play(typeof(sound) === 'string' ? sound : 'notice');
};
/**
 * Notify inactive
 *
 * @param {String} message
 * @param {Number} duration
 * @param {String} sound
 */
Notifier.prototype.notifyInactive = function(message, duration, sound)
{
    if (!this.watcher.isActive() || !this.watcher.isFocused()) {
        this.display(message, duration);
        this.sound.play(typeof(sound) === 'string' ? sound : 'notice');
    }
};

/**
 * Set message
 *
 * @param {String} message
 * @param {Number} duration
 */
Notifier.prototype.display = function(message, duration)
{
    this.clearTimeout();
    this.write(message);
    setTimeout(this.clear, typeof(duration) === 'number' ? duration : this.duration);
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
