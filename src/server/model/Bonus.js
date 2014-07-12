/**
 * Bonus
 *
 * @param {Array} position
 */
function Bonus(position)
{
    BaseBonus.call(this, position);

    this.body   = new Body(this.position, this.radius, this);
    this.target = null;

    this.off = this.off.bind(this);
}

Bonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Aplly bonus callback
 */
Bonus.prototype.applyTo = function(avatar, game)
{
    this.target = this.getTarget(avatar, game);

    this.on();

    return setTimeout(this.off, this.duration);
};

/**
 * Get target
 *
 * @param {Avatar} avatar
 * @param {Game} game
 *
 * @return {Object}
 */
Bonus.prototype.getTarget = function(avatar, game)
{
    switch (this.affect) {
        case 'self':
            return avatar;
        case 'enemy':
            return game.avatars.filter(function () { return this.name !== avatar.name; }).items;
        case 'all':
            return game.avatars;
    }
};