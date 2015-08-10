/**
 * Stacked Bonus (for display in avatar's bonus stack)
 *
 * @param {Number} id
 * @param {String} type
 * @param {Number} duration
 */
function StackedBonus(id, type, duration)
{
    EventEmitter.call(this);

    this.id       = id;
    this.duration = duration;
    this.asset    = this.assets[type];
    this.changed  = true;

    this.setEnding     = this.setEnding.bind(this);
    this.toggleOpacity = this.toggleOpacity.bind(this);
}

StackedBonus.prototype = Object.create(EventEmitter.prototype);
StackedBonus.prototype.constructor = StackedBonus;

/**
 * Assets
 *
 * @type {Object}
 */
StackedBonus.prototype.assets = BonusManager.prototype.assets;

/**
 * Opacity
 *
 * @type {Number}
 */
StackedBonus.prototype.opacity = 1;

/**
 * Clear
 */
StackedBonus.prototype.clear = function()
{
    if (this.timeout) {
        this.timeout = clearInterval(this.timeout);
    }
};

/**
 * Set ending timeout
 *
 * @param {Number} warning
 */
StackedBonus.prototype.setEndingTimeout = function(warning)
{
    this.timeout = setTimeout(this.setEnding, this.duration - warning);
};

/**
 * Set ending
 */
StackedBonus.prototype.setEnding = function()
{
    this.timeout = setInterval(this.toggleOpacity, 100);
};

/**
 * Toggle opacity
 */
StackedBonus.prototype.toggleOpacity = function()
{
    this.opacity = this.opacity === 1 ? 0.5 : 1;
    this.changed = true;
    this.emit('change');
};
