/**
 * Base Bonus Manager
 */
function BaseBonusManager(game)
{
    EventEmitter.call(this);

    this.game       = game;
    this.bonuses    = new Collection([], 'id', true);
    this.popingTimeout = null;
    this.timeouts   = [];

    this.clear = this.clear.bind(this);
}

BaseBonusManager.prototype = Object.create(EventEmitter.prototype);

BaseBonusManager.prototype.bonusCap         = 20;
BaseBonusManager.prototype.bonusPoppingRate = 0.2;
BaseBonusManager.prototype.bonusPopingTime  = 3000;

/**
 * Start
 */
BaseBonusManager.prototype.start = function()
{
    //this.timeouts.push(setTimeout(this.toggleBonusPrinting, 3000));
    this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());
};

/**
 * Stop
 */
BaseBonusManager.prototype.stop = function()
{
    clearTimeout(this.popingTimeout);
    this.popingTimeout = null;

    this.clearTimeouts();
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
        //this.emit('bonus:clear', { game: this, bonus: bonus});
        this.bonuses.remove(bonus);
    }
};

/**
 * Has a percent of chance to return true
 *
 * @param percentTrue
 * @returns {boolean}
 */
BaseBonusManager.prototype.percentChance = function (percentTrue)
{
    percentTrue = percentTrue || 100;

    return (Math.floor(Math.random()*101) <= percentTrue);
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
BaseBonusManager.prototype.getRandomPopingTime  = function()
{
    return this.bonusPopingTime * (1 +  Math.random() * 2);
};

/**
 * Clear timeouts
 */
BaseBonusManager.prototype.clearTimeouts = function()
{
    for (var i = this.timeouts.length - 1; i >= 0; i--) {
        clearTimeout(this.timeouts[i]);
    }
};