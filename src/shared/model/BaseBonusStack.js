/**
 * Base Bonus Stack
 *
 * @param {Avatar} avatar
 */
function BaseBonusStack (avatar)
{
    EventEmitter.call(this);

    this.avatar  = avatar;
    this.bonuses = new Collection();
}

BaseBonusStack.prototype = Object.create(EventEmitter.prototype);
BaseBonusStack.prototype.constructor = BaseBonusStack;

/**
 * Add bonus to the stack
 *
 * @param {Bonus} bonus
 */
BaseBonusStack.prototype.add = function(bonus)
{
    if (this.bonuses.add(bonus)) {
        this.resolve();
    }
};

/**
 * Remove bonus from the stack
 *
 * @param {Bonus} bonus
 */
BaseBonusStack.prototype.remove = function(bonus)
{
    if (this.bonuses.remove(bonus)) {
        this.resolve(bonus.effects);
    }
};

/**
 * Resolve
 */
BaseBonusStack.prototype.resolve = function(effects)
{
    var properties = {},
        bonus, property, i;

    if (typeof(effects) !== 'undefined') {
        for (property in effects) {
            if (effects.hasOwnProperty(property)) {
                properties[property] = this.getDefaultProperty(property);
            }
        }
    }

    for (i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];

        for (property in bonus.effects) {
            if (bonus.effects.hasOwnProperty(property)) {
                if (typeof(properties[property]) === 'undefined') {
                    properties[property] = this.getDefaultProperty(property);
                }

                properties[property] += bonus.effects[property];
            }
        }
    }

    for (property in properties) {
        if (properties.hasOwnProperty(property)) {
            this.apply(property, properties[property]);
        }
    }
};

/**
 * Apply the value to avatar's property
 *
 * @param {String} property
 * @param {Number} value
 */
BaseBonusStack.prototype.apply = function(property, value)
{
    if (property === 'radius') {
        return this.avatar.setRadius(value);
    }

    if (property === 'velocity') {
        return this.avatar.setVelocity(value);
    }

    if (property === 'inverse') {
        return this.avatar.setInverse(value%2 !== 0);
    }

    if (property === 'invincible') {
        return this.avatar.setInvincible(value ? true : false);
    }

    if (property === 'printing') {
        return this.avatar.setPrintingWithTimeout(value > 0);
    }
};

/**
 * Get default property
 *
 * @param {String} property
 *
 * @return {Number}
 */
BaseBonusStack.prototype.getDefaultProperty = function(property, avatar)
{
    if (property === 'printing') {
        return 1;
    }

    if (property === 'color') {
        if (typeof(avatar.ownColor) === 'undefined') {
            avatar.ownColor = avatar.color;
        }

        return avatar.ownColor;
    }

    return Avatar.prototype[property];
};

/**
 * Clear
 */
BaseBonusStack.prototype.clear = function()
{
    this.bonuses.clear();
};