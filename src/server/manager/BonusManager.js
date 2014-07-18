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
 * Available onus types
 *
 * @type {Array}
 */
BonusManager.prototype.bonusTypes = [
    TurtleSelfBonus,
    RabbitSelfBonus,
    TurtleEnemyBonus,
    RabbitEnemyBonus,
    GodzillaEnemyBonus,
    SmallerEnemyBonus,
    SmallerSelfBonus,
    ColorSelfBonus,
    ColorEnemyBonus
];

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
};

/**
 * Clear
 */
BonusManager.prototype.clear = function()
{
    this.world.clear();
    BaseBonusManager.prototype.clear.call(this);
};

/**
 * Make a bonus 'pop'
 */
BonusManager.prototype.popBonus = function ()
{
    clearTimeout(this.popingTimeout);
    this.popingTimeout = null;

    if (this.bonuses.count() < this.bonusCap) {
        var position = this.game.world.getRandomPosition(BaseBonus.prototype.radius, 0.03),
            bonus = this.getRandomBonus(position);

        this.add(bonus);
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
    if (!avatar.body) {
        throw avatar;
    }
    var body = this.world.getBody(avatar.body),
        bonus = body ? body.data : null;

    if (bonus && this.remove(bonus)) {
        this.timeouts.push(bonus.applyTo(avatar, this.game));
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
        this.world.addBody(bonus.body);
        this.emit('bonus:pop', { game: this.game, bonus: bonus });

        return true;
    }

    return false;
};

/**
 *  Remove bonus
 *
 * @param {Bonus} bonus
 */
BonusManager.prototype.remove = function(bonus)
{
    if (BaseBonusManager.prototype.remove.call(this, bonus)) {
        this.world.removeBody(bonus.body);
        this.emit('bonus:clear', {game: this.game, bonus: bonus});

        return true;
    }

    return false;
};

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

/**
 * Get random bonus
 *
 * @param {Array} position
 *
 * @return {Bonus}
 */
BonusManager.prototype.getRandomBonus = function(position)
{
    var type = this.bonusTypes[Math.floor(Math.random() * this.bonusTypes.length)];

    return new type(position);
};
