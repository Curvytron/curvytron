/**
 * Preset
 */
function Preset () {}

/**
 * Bonuses
 *
 * @type {Array}
 */
Preset.prototype.bonuses = [];

/**
 * Has onus
 *
 * @param {String} bonus
 *
 * @return {Boolean}
 */
Preset.prototype.hasBonus = function(bonus)
{
    return this.bonuses.indexOf(bonus) > -1;
};
