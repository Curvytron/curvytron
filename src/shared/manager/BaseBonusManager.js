/**
 * Base Bonus Manager
 */
function BaseBonusManager(game)
{
    EventEmitter.call(this);

    this.game    = game;
    this.bonuses = new Collection([], 'id', true);

    this.clear = this.clear.bind(this);
}

BaseBonusManager.prototype = Object.create(EventEmitter.prototype);

BaseBonusManager.prototype.bonusCap         = 20;
BaseBonusManager.prototype.bonusPoppingRate = 0.2;
BaseBonusManager.prototype.bonusPopingTime  = 1000;

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

/**
 * Get random bonus
 *
 * @param {Array} position
 *
 * @return {Bonus}
 */
BaseBonusManager.prototype.getRandomBonus = function(position)
{
    var type = this.bonusTypes[Math.floor(Math.random() * this.bonusTypes.length)];

    return new type(position);
};
