/**
 * Trail
 * @constructor
 */
function Trail()
{
    paper.Path.call(this);

    this.head         = new paper.Point(0, 0);
    this.lastPosition = this.head.clone();

    this.angle        = 0.5;
    this.velocities   = [];
    this.key          = false;

    this.updateVelocities();

    this.strokeColor = this.color;
    this.strokeWidth = this.radius;
    this.strokeCap   = 'round';
    this.strokeJoin  = 'round';
    this.fullySelected = true;

    this.strokeColor = this.color;
    this.strokeWidth = this.radius;
    this.strokeCap   = 'round';
    this.strokeJoin  = 'round';
    this.fullySelected = true;


    var trail = this;

    // temporary, the control should be on the player and the trail should only respond to specific events
    window.addEventListener('keydown', function (e) { trail.key = e.keyCode; });
    window.addEventListener('keyup', function (e) { trail.key = false; });
}

Trail.prototype = Object.create(paper.Path.prototype);

Trail.prototype.velocity  = 5;
Trail.prototype.radius    = 10;
Trail.prototype.precision = 10;


/**
 * Update
 *
 * @param {Number} step
 */
Trail.prototype.update = function(step)
{
    if (this.key) {
        this.setAngle(this.angle + 0.1 * (this.key == '37' ? -1 : 1));
    }

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
 * Update velocities
 */
Trail.prototype.updateVelocities = function()
{
    this.velocities = [
        Math.cos(this.angle) * this.velocity,
        Math.sin(this.angle) * this.velocity
    ];
};