/**
 * Big All Color
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusAllColor(x, y)
{
    BonusAll.call(this, x, y);

    this.getColor = this.getColor.bind(this);
}

BonusAllColor.prototype = Object.create(BonusAll.prototype);
BonusAllColor.prototype.constructor = BonusAllColor;

/**
 * Duration
 *
 * @type {Number}
 */
BonusAllColor.prototype.duration = 7500;

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
        this.avatars[i] = targets[i].id;
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
    var index = this.avatars.indexOf(avatar.id);

    return this.colors[(index + 1) % this.colors.length];
};
