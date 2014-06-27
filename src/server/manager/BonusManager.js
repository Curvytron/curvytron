/**
 * Bonus Manager
 *
 * @param {Game} game
 */
function BonusManager(game)
{
    BaseBonusManager.call(this, game);

    this.world         = new World(this.game.size, 1);
    this.popingTimeout = null;
    this.timeouts      = [];

    this.popBonus = this.popBonus.bind(this);
}

BonusManager.prototype = Object.create(BaseBonusManager.prototype);

/**
 * Start
 */
BonusManager.prototype.start = function()
{
    BaseBonusManager.prototype.start.call(this);

    this.world.activate();

    this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());
};

/**
 * Stop
 */
BonusManager.prototype.stop = function()
{
    BaseBonusManager.prototype.stop.call(this);

    clearTimeout(this.popingTimeout);
    this.popingTimeout = null;

    this.clearTimeouts();

    this.world.clear();
};

/**
 * Make a bonus 'pop'
 */
BonusManager.prototype.popBonus = function ()
{
    clearTimeout(this.popingTimeout);
    this.popingTimeout = null;

    if (this.bonuses.count() < this.bonusCap) {

        var bonus = this.getRandomBonus(this.game.world.getRandomPosition(bonus.radius, 0.03));

        this.addBonus(bonus);
    }

    this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());
};

/**
 * Test if an avatar catches a bonus
 *
 * @param {Avatar} avatar
 */
BonusManager.prototype.testCatch = function(avatar)
{
    var circle = this.world.getCircle([avatar.head[0], avatar.head[1], avatar.radius, 0]);

    if (circle) {
        var bonus = circle[4];
        if (bonus.active === true) {
            this.timeouts.push(bonus.applyTo(avatar));
            this.remove(bonus);
        }
    }
};

/**
 * Add bonus
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.add = function (bonus)
{
    if (BaseBonusManager.prototype.add.call(this, bonus)) {
        this.world.addCircle([
            bonus.position[0],
            bonus.position[1],
            bonus.radius,
            0,
            bonus
        ]);

        this.emit('bonus:pop', { game: this.game, bonus: bonus });
    }
};

/**
 *  Remove bonus
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.remove = function(bonus)
{
    if (BaseBonusManager.prototype.remove.call(this, bonus)) {
        this.emit('bonus:clear', {game: this.game, bonus: bonus});
    }
}

/**
 * Clear timeouts
 */
BonusManager.prototype.clearTimeouts = function()
{
    for (var i = this.timeouts.length - 1; i >= 0; i--) {
        clearTimeout(this.timeouts[i]);
    }

    this.timeouts = [];
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
BonusManager.prototype.getRandomPopingTime  = function()
{
    return this.bonusPopingTime * (1 +  Math.random() * 2);
};
