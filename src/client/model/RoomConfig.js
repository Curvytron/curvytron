/**
 * Room Configuration
 *
 * @param {Room} room
 */
function RoomConfig(room)
{
    BaseRoomConfig.call(this, room);

    this.preset       = this.getDefaultPreset();
    this.customPreset = new CustomPreset();
}

RoomConfig.prototype = Object.create(BaseRoomConfig.prototype);
RoomConfig.prototype.constructor = RoomConfig;

/**
 * Bonus classes
 *
 * @type {Object}
 */
RoomConfig.prototype.bonusClasses = {
    BonusSelfSmall: 'bonus-self-small',
    BonusSelfSlow: 'bonus-self-slow',
    BonusSelfFast: 'bonus-self-fast',
    BonusSelfMaster: 'bonus-self-master',
    BonusEnemySlow: 'bonus-enemy-slow',
    BonusEnemyFast: 'bonus-enemy-fast',
    BonusEnemyBig: 'bonus-enemy-big',
    BonusEnemyInverse: 'bonus-enemy-inverse',
    BonusEnemyStraightAngle: 'bonus-enemy-straight-angle',
    BonusGameBorderless: 'bonus-game-borderless',
    BonusAllColor:'bonus-all-color',
    BonusGameClear: 'bonus-all-clear'
};

/**
 * Variables names
 *
 * @type {Object}
 */
RoomConfig.prototype.variablesNames = {
    bonusRate: 'Bonus quantity'
};

/**
 * Presets
 *
 * @type {Object}
 */
RoomConfig.prototype.presets = [
    new DefaultPreset(),
    new SpeedPreset(),
    new SizePreset(),
    new SoloPreset(),
    new EmptyPreset()
];

/**
 * Set open
 *
 * @param {String} open
 */
RoomConfig.prototype.setOpen = function(open)
{
    this.open = open;
};

/**
 * Set password
 *
 * @param {String} password
 */
RoomConfig.prototype.setPassword = function(password)
{
    this.password = password;
};

/**
 * Get available bonuses
 *
 * @return {Array}
 */
RoomConfig.prototype.getBonuses = function()
{
    var bonuses = [];

    for (var bonus in this.bonuses) {
        if (this.bonuses[bonus]) {
            bonuses.push(bonus);
        }
    }

    return bonuses.sort();
};

/**
 * Set bonus value
 *
 * @param {String} bonus
 * @param {Boolean} value
 *
 * @return {Boolean}
 */
RoomConfig.prototype.setBonus = function(bonus, value)
{
    BaseRoomConfig.prototype.setBonus.call(this, bonus, value);
    this.checkPresets();
};

/**
 * Check preset
 */
RoomConfig.prototype.checkPresets = function()
{
    var bonuses = this.getBonuses(),
        preset;

    for (var i = this.presets.length - 1; i >= 0; i--) {
        preset = this.presets[i];
        if (this.bonusesMatch(preset.bonuses, bonuses)) {
            this.preset = preset;

            return;
        }
    }

    this.preset = this.customPreset;
};

/**
 * Bonuses match
 *
 * @param {Array} listA
 * @param {Array} listB
 *
 * @return {Boolean}
 */
RoomConfig.prototype.bonusesMatch = function(listA, listB)
{
    if (typeof(listA) !== 'object' || typeof(listA) !== 'object') {
        return false;
    }

    return listA.length === listB.length && listA.sort().toString() === listB.sort().toString();
};

/**
 * IS default preset
 *
 * @return {Boolean}
 */
RoomConfig.prototype.isDefaultPreset = function()
{
    return this.preset === this.getDefaultPreset();
};

/**
 * Get default preset
 *
 * @return {Preset}
 */
RoomConfig.prototype.getDefaultPreset = function()
{
    return this.presets[0];
};

/**
 * Get custom preset
 *
 * @return {CustomPreset}
 */
RoomConfig.prototype.getCustomPreset = function()
{
    return this.customPreset;
};
