/**
 * Player
 *
 * @param {String} color
 */
function Player(color)
{
    this.color        = color || 'red';
    this.head         = new paper.Point(0, 0);
    this.lastPosition = this.head.clone();
    this.trail        = new paper.Path();
    this.angle        = 0.5;
    this.velocities   = [];
    this.key          = false;

    this.updateVelocities();

    this.trail.strokeColor = this.color;
    this.trail.strokeWidth = this.radius;
    this.trail.strokeCap   = 'round';
    this.trail.strokeJoin  = 'round';
    this.trail.fullySelected = true;

    var player = this;

    window.addEventListener('keydown', function (e) { player.key = e.keyCode; });
    window.addEventListener('keyup', function (e) { player.key = false; });

}

Player.prototype.velocity  = 5;
Player.prototype.radius    = 10;
Player.prototype.precision = 10;

/**
 * Update
 *
 * @param {Number} step
 */
Player.prototype.update = function(step)
{
    if (this.key) {
        this.setAngle(this.angle + 0.1 * (this.key == '37' ? -1 : 1));
    }

    this.head = this.head.add(this.velocities);

    if (this.lastPosition.getDistance(this.head) > this.precision) {
        this.lastPosition = this.head.clone();
        this.trail.moveTo(this.head);
        /*this.trail.add(this.head.add(this.velocities));
        this.trail.smooth();*/
        this.trail.lineTo(this.head);
    }
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
Player.prototype.setAngle = function(angle)
{
    this.angle = angle;

    this.updateVelocities();
};

/**
 * Update velocities
 */
Player.prototype.updateVelocities = function()
{
    this.velocities = [
        Math.cos(this.angle) * this.velocity,
        Math.sin(this.angle) * this.velocity
    ];
};