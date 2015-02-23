/**
 * Custom Preset
 */
function CustomPreset ()
{
    Preset.call(this);
}

CustomPreset.prototype = Object.create(Preset.prototype);
CustomPreset.prototype.constructor = CustomPreset;

/**
 * Name
 *
 * @type {String}
 */
CustomPreset.prototype.name = 'Custom';
