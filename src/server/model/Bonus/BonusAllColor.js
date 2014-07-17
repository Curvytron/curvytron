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
BonusAll.prototype.getTarget = function(avatar, game)
{
    var targets = BonusAll.prototype.getTarget.call(this, avatar, game);

    this.colors = new Array(targets.length);

    for (var i = targets.length - 1; i >= 0; i--) {
        this.colors[i] = targets[i].color;
    }

    return targets;
};

/**
 * Get color
 *
 * @param {Number} index
 * @param {Avatar} avatar
 *
 * @return {String}
 */
BonusAll.prototype.getColor = function(index, avatar)
{
    // body...
};