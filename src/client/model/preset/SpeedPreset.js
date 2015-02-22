/**
 * Speed Preset
 */
function SpeedPreset ()
{
    Preset.call(this);
}

SpeedPreset.prototype = Object.create(Preset.prototype);
SpeedPreset.prototype.constructor = SpeedPreset;

/**
 * Name
 *
 * @type {String}
 */
SpeedPreset.prototype.name = 'Speed of light';

/**
 * Bonuses
 *
 * @type {Array}
 */
SpeedPreset.prototype.bonuses = [
    'BonusSelfFast',
    'BonusEnemyFast'
];
