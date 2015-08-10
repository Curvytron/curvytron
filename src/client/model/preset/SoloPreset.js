/**
 * Solo Preset
 */
function SoloPreset ()
{
    Preset.call(this);
}

SoloPreset.prototype = Object.create(Preset.prototype);
SoloPreset.prototype.constructor = SoloPreset;

/**
 * Name
 *
 * @type {String}
 */
SoloPreset.prototype.name = 'Solo';

/**
 * Bonuses
 *
 * @type {Array}
 */
SoloPreset.prototype.bonuses = [
    'BonusSelfSmall',
    'BonusSelfSlow',
    'BonusSelfFast',
    'BonusSelfMaster',
    'BonusGameBorderless',
    'BonusGameClear'
];
