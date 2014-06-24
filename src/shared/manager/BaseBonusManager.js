/**
 * Base Bonus Manager
 */
function BaseBonusManager(game)
{
    EventEmitter.call(this);

    this.game       = game;
    this.world      = new World(this.game.size, 1);
    this.bonuses    = new Collection([], 'id', true);
    this.popingTimeout = null;
    this.timeouts   = [];

    this.popBonus = this.popBonus.bind(this);
    this.clear    = this.clear.bind(this);
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
 * Make a bonus 'pop'
 */
BaseBonusManager.prototype.popBonus = function ()
{
    if (this.bonuses.count() < this.bonusCap) {
        //if (this.percentChance(this.bonusPoppingRate)) {
        var bonus;

        if (this.percentChance(50)) {
            bonus = new RabbitBonus('test');
        } else {
            bonus = new TurtleBonus('test');
        }

        bonus.setPosition(this.game.world.getRandomPosition(bonus.radius, 0.1));
        bonus.pop();

        this.bonuses.add(bonus);

        this.emit('bonus:pop', { game: this.game, bonus: bonus });
        //}
    }

    this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());
};

/**
 * Test if an avatar catches a bonus
 *
 * @param {Avaatr} avatar
 */
BaseBonusManager.prototype.testCatch = function(avatar)
{
    var bonus = this.world.getCircle(position);

    if (bonus) {
        bonus.clear();
        this.emit('bonus:clear', {game: this, bonus: bonus});
        this.timeouts.push(bonus.apply(avatar));
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