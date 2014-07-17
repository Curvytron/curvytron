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
        this.resolve(bonus.property);
    }
};

/**
 * Resolve
 */
BaseBonusStack.prototype.resolve = function(property)
{
    var properties = {},
        bonus, i;

    if (typeof(property) !== 'undefined') {
        properties[property] = this.getDefaultProperty(property);
    }

    for (i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];

        if (typeof(properties[bonus.property]) === 'undefined') {
            properties[bonus.property] = this.getDefaultProperty(bonus.property);
        }

        properties[bonus.property] += bonus.step;
    }

    for (var property in properties) {
        this.apply(property, properties[property]);
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
            this.avatar.setRadius(value);
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

        case 'godzilla':
            if (value) {
                this.avatar.setInvincible(true);
                this.avatar.setRadius(10);
                this.avatar.setVelocity(4);
            } else {
                this.avatar.setRadius(this.getDefaultProperty('radius'));
                this.avatar.setVelocity(this.getDefaultProperty('velocity'));
                this.avatar.setInvincible(false);
            }
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
BaseBonusStack.prototype.getDefaultProperty = function(property)
{
    switch (property) {
        case 'godzilla':
            return false;

        default:
            return Avatar.prototype[property];
    }
};

/**
 * Clear
 */
BaseBonusStack.prototype.clear = function()
{
    this.bonuses.clear();
};