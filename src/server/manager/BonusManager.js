/**
 * Bonus Manager
 *
 * @param {Game} game
 */
function BonusManager(game, bonuses, rate)
{
    BaseBonusManager.call(this, game);

    this.world           = new World(this.game.size, 1);
    this.popingTimeout   = null;
    this.bonusTypes      = bonuses;
    this.bonusPopingTime = this.bonusPopingTime - ((this.bonusPopingTime/2) * rate);

    this.popBonus = this.popBonus.bind(this);
}

BonusManager.prototype = Object.create(BaseBonusManager.prototype);
BonusManager.prototype.constructor = BonusManager;

/**
 * Start
 */
BonusManager.prototype.start = function()
{
    BaseBonusManager.prototype.start.call(this);

    this.world.activate();

    if (this.bonusTypes.length) {
        this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());
    }
};

/**
 * Stop
 */
BonusManager.prototype.stop = function()
{
    if (this.popingTimeout) {
        this.popingTimeout = clearTimeout(this.popingTimeout);
    }

    BaseBonusManager.prototype.stop.call(this);
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
    if (this.bonusTypes.length) {
        this.popingTimeout = setTimeout(this.popBonus, this.getRandomPopingTime());

        if (this.bonuses.count() < this.bonusCap) {
            var bonusType = this.getRandomBonusType();

            if (bonusType) {
                var position = this.getRandomPosition(BaseBonus.prototype.radius, this.bonusPopingMargin),
                    bonus    = new (bonusType)(position[0], position[1]);
                this.add(bonus);
            }
        }
    }
};

/**
 * Get random position
 *
 * @param {Number} radius
 * @param {Number} border
 *
 * @return {Array}
 */
BonusManager.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.game.world.size,
        body   = new Body(
            this.game.world.getRandomPoint(margin),
            this.game.world.getRandomPoint(margin),
            margin
        );

    while (!this.game.world.testBody(body) || !this.world.testBody(body)) {
        body.x = this.game.world.getRandomPoint(margin);
        body.y = this.game.world.getRandomPoint(margin);
    }

    return [body.x, body.y];
};

/**
 * Test if an avatar catches a bonus
 *
 * @param {Avatar} avatar
 */
BonusManager.prototype.testCatch = function(avatar)
{
    if (avatar.body) {
        var body  = this.world.getBody(avatar.body),
            bonus = body ? body.data : null;

        if (bonus && this.remove(bonus)) {
            bonus.applyTo(avatar, this.game);
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
        this.world.addBody(bonus.body);
        this.emit('bonus:pop', bonus);

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
        this.emit('bonus:clear', bonus);

        return true;
    }

    return false;
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
BonusManager.prototype.getRandomPopingTime  = function()
{
    return this.bonusPopingTime * (1 +  Math.random());
};

/**
 * Get random bonus type
 *
 * @return {Bonus}
 */
BonusManager.prototype.getRandomBonusType = function()
{
    if (!this.bonusTypes.length) { return null; }

    var total   = this.bonusTypes.length,
        pot     = [],
        bonuses = [],
        bonus,
        probability,
        bonusType;

    for (var i = 0; i < total; i++) {
        bonusType   = this.bonusTypes[i];
        probability = bonusType.prototype.getProbability(this.game);

        if (probability > 0) {
            bonuses.push(bonusType);
            pot.push(probability + (i > 0 ? pot[pot.length-1] : 0));
        }
    }

    var value = Math.random() * pot[pot.length - 1];

    for (i = 0; i < total; i++) {
        if (value < pot[i]) {
            return bonuses[i];
        }
    }

    return null;
};

/**
 * Update size
 */
BonusManager.prototype.setSize = function()
{
    this.world.clear();
    this.world = new World(this.game.size, 1);
};
