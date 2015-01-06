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
        effects, property, value, i, j;

    if (typeof(bonus) !== 'undefined') {
        effects = bonus.getEffects(this.avatar);
        for (i = effects.length - 1; i >= 0; i--) {
            property = effects[i][0];
            properties[property] = this.getDefaultProperty(property);
        }
    }

    for (i = this.bonuses.items.length - 1; i >= 0; i--) {
        effects = this.bonuses.items[i].getEffects(this.avatar);
        for (j = effects.length - 1; j >= 0; j--) {
            property = effects[j][0];

            if (typeof(properties[property]) === 'undefined') {
                properties[property] = this.getDefaultProperty(property);
            }

            properties = this.append(properties, property, effects[j][1]);
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
    switch (property) {
        case 'radius':
            this.avatar.setRadius(Avatar.prototype.radius * Math.pow(2, value));
            break;
        case 'velocity':
            this.avatar.setVelocity(value);
            break;
        case 'inverse':
            this.avatar.setInverse(value%2 !== 0);
            break;
        case 'invincible':
            this.avatar.setInvincible(value ? true : false);
            break;
        case 'printing':
            this.avatar.printManager[value > 0 ? 'start' : 'stop']();
            break;
        case 'color':
            this.avatar.setColor(value);
            break;
        case 'borderless':
            this.avatar.setBorderless(value ? true : false);
            break;
        default:
            this.avatar[property] = value;
            break;
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
    switch (property) {
        case 'printing':
            return 1;
        case 'radius':
            return 0;
        case 'color':
            return this.avatar.player.color;
        default:
            return Avatar.prototype[property];
    }
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

        case 'directionInLoop':
        case 'angularVelocityBase':
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
