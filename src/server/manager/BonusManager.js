/**
 * Bonus Manager
 *
 * @param {Game} game
 */
function BonusManager(game)
{
    BaseBonusManager.call(this, game);

    this.world = new World(this.game.size, 1);

    this.popBonus = this.popBonus.bind(this);
}

BonusManager.prototype = Object.create(BaseBonusManager.prototype);

/**
 * Make a bonus 'pop'
 */
BonusManager.prototype.popBonus = function ()
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

        this.world.addCircle([
            bonus.position[0],
            bonus.position[1],
            bonus.radius,
            bonus
        ]);

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
BonusManager.prototype.testCatch = function(avatar)
{
    var bonus = this.world.getCircle([
        avatar.head[0],
        avatar.head[1],
        avatar.radius
    ]);

    if (bonus) {
        bonus.clear();
        this.emit('bonus:clear', {game: this, bonus: bonus});
        this.timeouts.push(bonus.apply(avatar));
    }
};