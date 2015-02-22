/**
 * Empty Preset
 */
function EmptyPreset ()
{
    Preset.call(this);
}

EmptyPreset.prototype = Object.create(Preset.prototype);
EmptyPreset.prototype.constructor = EmptyPreset;

/**
 * Name
 *
 * @type {String}
 */
EmptyPreset.prototype.name = 'No bonuses';
