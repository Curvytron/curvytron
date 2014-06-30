/**
 * Bonus
 *
 * @param {Array} position
 */
function Bonus(position)
{
    BaseBonus.call(this, position);

    this.body = new Body(this.position, this.radius, this);
}

Bonus.prototype = Object.create(BaseBonus.prototype);