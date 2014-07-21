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
        this.resolve(bonus);
    }
};

/**
 * Resolve
 */
BaseBonusStack.prototype.resolve = function(bonus)
{
    var properties = {},
        effects, property, value, i;

    if (typeof(bonus) !== 'undefined') {
        effects = bonus.getEffects(this.avatar);
        for (i = effects.length - 1; i >= 0; i--) {
            property = effects[i][0];
            properties[property] = this.getDefaultProperty(property);
        }
    }

    for (i = this.bonuses.items.length - 1; i >= 0; i--) {
        effects = this.bonuses.items[i].getEffects(this.avatar);
        for (i = effects.length - 1; i >= 0; i--) {
            property = effects[i][0];

            if (typeof(properties[property]) === 'undefined') {
                properties[property] = this.getDefaultProperty(property);
            }

            properties = this.append(properties, property, effects[i][1]);
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

    if (property === 'color') {
        return this.avatar.setColor(value);
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
        return this.avatar.ownColor;
    }

    return Avatar.prototype[property];
};

/**
 * Append
 *
 * @param {Object} properties
 * @param {String} property
 * @param {Number} value
 *
 * @return {Object}
 */
BaseBonusStack.prototype.append = function(properties, property, value)
{
    switch (property) {

        case 'color':
            properties[property] = value;
            break;

        default:
            properties[property] += value;
            break;
    }

    return properties;
};

/**
 * Clear
 */
BaseBonusStack.prototype.clear = function()
{
    this.bonuses.clear();
};