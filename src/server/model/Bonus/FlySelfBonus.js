/**
 * Fly Enemy Bonus
 *
 * @param {Array} position
 */
function FlySelfBonus(position)
{
    Bonus.call(this, position);
}

FlySelfBonus.prototype = Object.create(Bonus.prototype);

FlySelfBonus.prototype.type     = 'fly';
FlySelfBonus.prototype.affect   = 'self';
FlySelfBonus.prototype.step     = BaseAvatar.prototype.defaultRadius;
FlySelfBonus.prototype.duration = 5000;

/**
 * On
 */
FlySelfBonus.prototype.on = function()
{
    this.target.setPrinting(false);
    this.target.getRandomPrintingTime = function() {
        return FlySelfBonus.prototype.duration;
    }
};

/**
 * Off
 */
FlySelfBonus.prototype.off = function()
{
};
