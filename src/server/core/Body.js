/**
 * Body
 *
 * @param {Array} position
 * @param {Number} radius
 * @param {Number} mask
 * @param {Object} data
 */
function Body (position, radius, data, mask)
{
    this.position = position;
    this.radius   = radius;
    this.data     = data;
    this.islands  = new Collection();
    this.mask     = typeof(mask) !== 'undefined' ? mask : null;
    this.id       = null;

    this.clearMask = this.clearMask.bind(this);
}

/**
 * Clear mask
 */
Body.prototype.setMask = function(mask, duration)
{
    this.mask = mask;

    if (typeof(duration) === 'number') {
        setTimeout(this.clearMask, duration);
    }
};

/**
 * Clear mask
 */
Body.prototype.clearMask = function()
{
    this.mask = null;
};

/**
 * Match mask
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
Body.prototype.matchMask = function(body)
{
    return this.mask && body.mask ? this.mask !== body.mask : true;
};