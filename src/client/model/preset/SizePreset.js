/**
 * Size Preset
 */
function SizePreset ()
{
    Preset.call(this);
}

SizePreset.prototype = Object.create(Preset.prototype);
SizePreset.prototype.constructor = SizePreset;

/**
 * Name
 *
 * @type {String}
 */
SizePreset.prototype.name = 'Super size me';

/**
 * Bonuses
 *
 * @type {Array}
 */
SizePreset.prototype.bonuses = [
    'BonusEnemyBig'
];
