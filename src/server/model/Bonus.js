/**
 * Bonus
 *
 * @param {Array} position
 */
function Bonus(position)
{
    BaseBonus.call(this, position);

    this.body    = new Body(this.position, this.radius, this);
    this.target  = null;
    this.timeout = null;
}

Bonus.prototype = Object.create(BaseBonus.prototype);
Bonus.prototype.constructor = Bonus;

/**
 * Aplly bonus callback
 */
Bonus.prototype.applyTo = function(avatar, game)
{
    this.target  = this.getTarget(avatar, game);

    if (this.duration) {
        this.timeout = setTimeout(this.off, this.duration);
    }

    this.on();
};