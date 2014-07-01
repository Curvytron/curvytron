/**
 * Base Bonus Manager
 *
 * @param {Game} game
 */
function BaseBonusManager(game)
{
    EventEmitter.call(this);

    this.game    = game;
    this.bonuses = new Collection([], 'id', true);

    this.clear = this.clear.bind(this);
}

BaseBonusManager.prototype = Object.create(EventEmitter.prototype);

/**
 * Maximum number of bonus on the map at the same time
 *
 * @type {Number}
 */
BaseBonusManager.prototype.bonusCap = 20;

/**
 * Interval between two bons pop (will vary from a factor x1 to x3)
 *
 * @type {Number}
 */
BaseBonusManager.prototype.bonusPopingTime = 1000;

/**
 * Start
 */
BaseBonusManager.prototype.start = function() {};

/**
 * Stop
 */
BaseBonusManager.prototype.stop = function()
{
    this.clear();
};

/**
 * Add bonus
 *
 * @param {Bonus} bonus
 */
BaseBonusManager.prototype.add = function(bonus)
{
    return this.bonuses.add(bonus);
};

/**
 * Remove bonus
 *
 * @param {Bonus} bonus
 */
BaseBonusManager.prototype.remove = function(bonus)
{
    bonus.clear();

    return this.bonuses.remove(bonus);
};

/**
 * Clear bonuses
 */
BaseBonusManager.prototype.clear = function()
{
    for (var i = this.bonuses.items.length - 1; i >= 0; i--) {
        this.bonuses.items[i].clear();
    }

    this.bonuses.clear();
};
