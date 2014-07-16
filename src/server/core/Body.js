/**
 * Body
 *
 * @param {Array} position
 * @param {Number} radius
 * @param {Object} data
 */
function Body (position, radius, data)
{
    this.position = position;
    this.radius   = radius;
    this.data     = data;
    this.islands  = new Collection();
    this.id       = null;
}

/**
 * Match?
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
Body.prototype.match = function(body)
{
    return true;
};