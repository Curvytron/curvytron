/**
 * Big All Color
 *
 * @param {Array} position
 */
function BonusAllColor(position)
{
    BonusAll.call(this, position);

    this.getColor = this.getColor.bind(this);

    this.effects = {
        color: this.getColor
    };
}

BonusAllColor.prototype = Object.create(BonusAll.prototype);
BonusAllColor.prototype.constructor = BonusAllColor;

/**
 * Get target
 *
 * @param {Avatar} avatar
 * @param {Game} game
 *
 * @return {Object}
 */
BonusAllColor.prototype.getTarget = function(avatar, game)
{
    var targets = BonusAll.prototype.getTarget.call(this, avatar, game);

    this.avatars = new Array(targets.length);
    this.colors  = new Array(targets.length);

    for (var i = targets.length - 1; i >= 0; i--) {
        this.avatars[i] = targets[i].name;
        this.colors[i]  = targets[i].color;
    }

    return targets;
};

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusAllColor.prototype.getEffects = function(avatar)
{
    return [['color', this.getColor(avatar)]];
};

/**
 * Get color
 *
 * @param {Avatar} avatar
 *
 * @return {String}
 */
BonusAllColor.prototype.getColor = function(avatar)
{
    var index = this.avatars.indexOf(avatar.name),
        roll = Math.floor(Math.random() * this.colors.length);

    return this.colors[(index + roll) % this.colors.length];
};