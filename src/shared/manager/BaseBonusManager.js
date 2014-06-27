/**
 * Base Bonus Manager
 */
function BaseBonusManager(game)
{
    EventEmitter.call(this);

    this.game       = game;
    this.bonuses    = new Collection([], 'id', true);

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
BaseBonusManager.prototype.stop = function() {
    this.clear();
};

/**
 * Clear bonuses
 */
BaseBonusManager.prototype.remove = function(bonus)
{
    bonus.clear();
    this.bonuses.remove(bonus);
};

/**
 * Clear bonuses
 */
BaseBonusManager.prototype.clear = function()
{
    var bonus, i;

    for (i = this.bonuses.items.length - 1; i >= 0; i--) {
        bonus = this.bonuses.items[i];
        bonus.clear();
        this.bonuses.remove(bonus);
    }
};
