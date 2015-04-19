/**
 * Bonus Stack
 *
 * @param {Avatar} avatar
 */
function BonusStack(avatar)
{
    BaseBonusStack.call(this, avatar);
}

BonusStack.prototype = Object.create(BaseBonusStack.prototype);
BonusStack.prototype.constructor = BonusStack;

/**
 * Add bonus to the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.add = function(bonus)
{
    BaseBonusStack.prototype.add.call(this, bonus);
    this.emit('change', {avatar: this.target, method: 'add', bonus: bonus});
};

/**
 * Remove bonus from the stack
 *
 * @param {Bonus} bonus
 */
BonusStack.prototype.remove = function(bonus)
{
    BaseBonusStack.prototype.remove.call(this, bonus);
    this.emit('change', {avatar: this.target, method: 'remove', bonus: bonus});
};

/**
 * Apply the value to target's property
 *
 * @param {String} property
 * @param {Number} value
 */
BonusStack.prototype.apply = function(property, value)
{
    switch (property) {
        case 'radius':
            this.target.setRadius(Avatar.prototype.radius * Math.pow(2, value));
            break;
        case 'velocity':
            this.target.setVelocity(value);
            break;
        case 'inverse':
            this.target.setInverse(value%2 !== 0);
            break;
        case 'invincible':
            this.target.setInvincible(value ? true : false);
            break;
        case 'printing':
            this.target.printManager[value > 0 ? 'start' : 'stop']();
            break;
        case 'color':
            this.target.setColor(value);
            break;
        default:
            BaseBonusStack.prototype.apply.call(this, property, value);
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
BonusStack.prototype.getDefaultProperty = function(property)
{
    switch (property) {
        case 'printing':
            return 1;
        case 'radius':
            return 0;
        case 'color':
            return this.target.player.color;
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
 */
BonusStack.prototype.append = function(properties, property, value)
{
    switch (property) {
        case 'directionInLoop':
        case 'angularVelocityBase':
        case 'color':
            properties[property] = value;
            break;

        default:
            BaseBonusStack.prototype.append.call(this, properties, property, value);
            break;
    }
};
