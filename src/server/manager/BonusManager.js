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
    if (this.bonuses.count() < this.bonusCap) {
        var bonus;

        if (this.percentChance(50)) {
            bonus = new RabbitBonus('test');
        } else {
            bonus = new TurtleBonus('test');
        }

        bonus.setPosition(this.game.world.getRandomPosition(bonus.radius, 0.1));
        bonus.pop();

        this.world.addCircle([
            bonus.position[0],
            bonus.position[1],
            bonus.radius,
            0,
            bonus
        ]);

        this.bonuses.add(bonus);

        this.emit('bonus:pop', { game: this.game, bonus: bonus });
    }

    this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());
};

/**
 * Test if an avatar catches a bonus
 *
 * @param {Avaatr} avatar
 */
BonusManager.prototype.testCatch = function(avatar)
{
    var circle = this.world.getCircle([
        avatar.head[0],
        avatar.head[1],
        avatar.radius,
        0,
    ]);

    if (circle) {
        var bonus = circle[4];
        if (bonus.active === true) {
            this.timeouts.push(
                bonus.applyTo(avatar)
            );

            this.remove(bonus);
        }
    }
};

/**
 *  Remove the given bonus
 */
BonusManager.prototype.remove = function(bonus)
{
    BaseBonusManager.prototype.remove.call(this, bonus);

    this.emit('bonus:clear', {game: this.game, bonus: bonus});
}

/**
 * Clear timeouts
 */
BonusManager.prototype.clearTimeouts = function()
{
    for (var i = this.timeouts.length - 1; i >= 0; i--) {
        clearTimeout(this.timeouts[i]);
    }
};

/**
 * Has a percent of chance to return true
 *
 * @param percentTrue
 * @returns {boolean}
 */
BonusManager.prototype.percentChance = function (percentTrue)
{
    percentTrue = percentTrue || 100;

    return (Math.floor(Math.random()*101) <= percentTrue);
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
