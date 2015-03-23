/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.bodyCount    = 0;
    this.body         = new AvatarBody(this.head, this);
    this.printManager = new PrintManager(this);
}

Avatar.prototype = Object.create(BaseAvatar.prototype);
Avatar.prototype.constructor = Avatar;

/**
 * Update
 *
 * @param {Number} step
 */
Avatar.prototype.update = function(step)
{
    if (this.alive) {
        this.updateAngle(step);
        this.updatePosition(step);

        var last = this.trail.getLast();

        if (this.printing && (!last || this.getDistance(last, this.head) > this.radius)) {
            this.addPoint(this.head.slice(0));
        }
    }

    BaseAvatar.prototype.update.call(this);
};

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setPosition = function(point)
{
    BaseAvatar.prototype.setPosition.call(this, point);

    this.body.position = this.head;
    this.body.num      = this.bodyCount;

    this.emit('property', {avatar: this, property: 'position', value: this.head});
};

/**
 * Set angle
 *
 * @param {Array} point
 */
Avatar.prototype.setAngle = function(angle)
{
    BaseAvatar.prototype.setAngle.call(this, angle);
    this.emit('property', {avatar: this, property: 'angle', value: this.angle});
};

/**
 * Set radius
 *
 * @param {Number} radius
 */
Avatar.prototype.setRadius = function(radius)
{
    BaseAvatar.prototype.setRadius.call(this, radius);
    this.body.radius = this.radius;
    this.emit('property', {avatar: this, property: 'radius', value: this.radius});
};

/**
 * Set invincible
 *
 * @param {Number} invincible
 */
Avatar.prototype.setInvincible = function(invincible)
{
    BaseAvatar.prototype.setInvincible.call(this, invincible);
    this.emit('property', {avatar: this, property: 'invincible', value: this.invincible});
};

/**
 * Set borderless
 *
 * @param {Number} borderless
 */
Avatar.prototype.setBorderless = function(borderless)
{
    BaseAvatar.prototype.setBorderless.call(this, borderless);
    this.emit('property', {avatar: this, property: 'borderless', value: this.borderless});
};

/**
 * Set inverse
 *
 * @param {Number} inverse
 */
Avatar.prototype.setInverse = function(inverse)
{
    BaseAvatar.prototype.setInverse.call(this, inverse);
    this.emit('property', {avatar: this, property: 'inverse', value: this.inverse});
};

/**
 * Set color
 *
 * @param {Number} color
 */
Avatar.prototype.setColor = function(color)
{
    this.color = color;
    this.emit('property', {avatar: this, property: 'color', value: this.color});
};

/**
 * Add point
 *
 * @param {Array} point
 */
Avatar.prototype.addPoint = function(point, important)
{
    BaseAvatar.prototype.addPoint.call(this, point);
    this.emit('point', { avatar: this, point: point, important: important || this.angularVelocity });
};

/**
 * Set printing
 *
 * @param {Boolean} printing
 */
Avatar.prototype.setPrinting = function(printing)
{
    BaseAvatar.prototype.setPrinting.call(this, printing);
    this.emit('property', {avatar: this, property: 'printing', value: this.printing});
};

/**
 * Die
 *
 * @param {Avatar|null} killer
 */
Avatar.prototype.die = function(killer)
{
    BaseAvatar.prototype.die.call(this);

    this.printManager.stop();
    this.addPoint(this.head.slice(0));
    this.emit('die', {
        avatar: this,
        killer: killer
    });
};

/**
 * Set score
 *
 * @param {Number} score
 */
Avatar.prototype.setScore = function(score)
{
    BaseAvatar.prototype.setScore.call(this, score);
    this.emit('property', {avatar: this, property: 'score', value: this.score});
};

/**
 * Set round score
 *
 * @param {Number} score
 */
Avatar.prototype.setRoundScore = function(score)
{
    BaseAvatar.prototype.setRoundScore.call(this, score);
    this.emit('property', {avatar: this, property: 'roundScore', value: this.roundScore});
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);
    this.printManager.stop();
    this.bodyCount = 0;
};
