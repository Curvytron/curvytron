/**
 * BaseTrail
 */
function BaseTrail(avatar)
{
    EventEmitter.call(this);

    this.avatar = avatar;
    this.color  = this.avatar.color;
    this.radius = this.avatar.radius;
    this.points = [];
    this.lastX  = null;
    this.lastY  = null;
}

BaseTrail.prototype = Object.create(EventEmitter.prototype);
BaseTrail.prototype.constructor = BaseTrail;

/**
 * Add point
 *
 * @param {Number} x
 * @param {Number} y
 */
BaseTrail.prototype.addPoint = function(x, y)
{
    this.points.push([x, y]);
    this.lastX = x;
    this.lastY = y;
};

/**
 * Clear
 */
BaseTrail.prototype.clear = function()
{
    this.points.length = 0;
    this.lastX = null;
    this.lastY = null;
};
