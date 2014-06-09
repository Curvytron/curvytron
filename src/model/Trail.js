/**
 * Trail
 * @constructor
 */
function Trail(color)
{
    paper.Path.call(this);
    console.log(this);

    this.color         = color;

    this.head          = new paper.Point(0, 0);
    this.lastPosition  = this.head.clone();

    this.angle         = 0.5;
    this.velocities    = [];

    this.strokeColor   = this.color;
    this.strokeWidth   = this.radius;
    this.strokeCap     = 'round';
    this.strokeJoin    = 'round';
    this.fullySelected = true;

    this.updateVelocities();
}

Trail.prototype = Object.create(paper.Path.prototype);

Trail.prototype.velocity      = 5;
Trail.prototype.radius        = 10;
Trail.prototype.precision     = 10;

/**
 * Update
 *
 * @param {Number} step
 */
Trail.prototype.update = function(step)
{
    this.head = this.head.add(this.velocities);

    if (this.lastPosition.getDistance(this.head) > this.precision) {
        this.lastPosition = this.head.clone();
        this.moveTo(this.head);
        /*this.add(this.head.add(this.velocities));
         this.smooth();*/
        this.lineTo(this.head);
    }
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
Trail.prototype.setAngle = function(angle)
{
    this.angle = angle;

    this.updateVelocities();
};

/**
 * Add angle
 *
 * @param {Float} angle
 */
Trail.prototype.addAngle = function(angle)
{
    this.setAngle(this.angle + angle);
};

/**
 * Update velocities
 */
Trail.prototype.updateVelocities = function()
{
    this.velocities = [
        Math.cos(this.angle) * this.velocity,
        Math.sin(this.angle) * this.velocity
    ];
};