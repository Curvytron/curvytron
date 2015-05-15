/**
 * Body
 *
 * @param {Float} x
 * @param {Float} y
 * @param {Number} radius
 * @param {Object} data
 */
function Body (x, y, radius, data)
{
    this.x       = x;
    this.y       = y;
    this.radius  = radius;
    this.data    = data;
    this.islands = new Collection();
    this.id      = null;
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
