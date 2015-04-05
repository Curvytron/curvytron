/**
 * Activity watcher
 */
function ActivityWatcher(client)
{
    this.client       = client;
    this.focused      = true;
    this.active       = true;
    this.lastActivity = new Date().getTime();
    this.interval     = null;

    this.onFocus         = this.onFocus.bind(this);
    this.onBlur          = this.onBlur.bind(this);
    this.checkInactivity = this.checkInactivity.bind(this);

    window.addEventListener('focus', this.onFocus);
    window.addEventListener('mousemove', this.onFocus);
    window.addEventListener('click', this.onFocus);
    window.addEventListener('keypress', this.onFocus);
    gamepadListener.addEventListener('gamepad:axis', this.onFocus);
    gamepadListener.addEventListener('gamepad:button', this.onFocus);
    window.addEventListener('blur', this.onBlur);

    this.interval = setInterval(this.checkInactivity, this.checkInterval);
}

/**
 * Tolerated time away from keyboard
 *
 * @type {Number}
 */
ActivityWatcher.prototype.tolerance = 60000;

/**
 * Activity check interval
 *
 * @type {Number}
 */
ActivityWatcher.prototype.checkInterval = 10000;

/**
 * Set active
 *
 * @param {Boolean} active
 */
ActivityWatcher.prototype.setActive = function(active)
{
    active = active ? true : false;

    if (active) {
        this.lastActivity = new Date().getTime();
    }

    if (this.active !== active) {
        this.active = active;
        this.client.addEvent('activity', this.active);

        if (this.active) {
            this.interval = setInterval(this.checkInactivity, this.checkInterval);
        } else {
            clearInterval(this.interval);
        }
    }
};

/**
 * Set focused
 *
 * @param {Boolean} focused
 */
ActivityWatcher.prototype.setFocused = function(focused)
{
    if (this.focused !== focused) {
        this.focused = focused;
    }
};

/**
 * On focus
 *
 * @param {Event} event
 */
ActivityWatcher.prototype.onFocus = function(event)
{
    this.setFocused(true);
    this.setActive(true);
};

/**
 * On blur
 *
 * @param {Event} event
 */
ActivityWatcher.prototype.onBlur = function(event)
{
    this.setFocused(false);
};

/**
 * Is active?
 *
 * @return {Boolean}
 */
ActivityWatcher.prototype.isActive = function()
{
    return this.active;
};

/**
 * Is focused?
 *
 * @return {Boolean}
 */
ActivityWatcher.prototype.isFocused = function()
{
    return this.focused;
};

/**
 * Check inactivity
 */
ActivityWatcher.prototype.checkInactivity = function()
{
    var inactivity = new Date().getTime() - this.lastActivity;

    if (inactivity > this.tolerance) {
        this.setActive(false);
    }
};
