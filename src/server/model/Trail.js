/**
 * Trail
 */
function Trail(color, radius)
{
    BaseTrail.call(this, color, radius);
}

Trail.prototype = Object.create(BaseTrail.prototype);