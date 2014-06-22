/**
 * BaseBonus
 *
 * @param name
 * @param color
 * @param radius
 */
function BaseBonus(name, color, radius)
{
    EventEmitter.call(this);
    this.id              = this.generateUUID();
    this.name            = name || this.defaultName;
    this.color           = color || this.defaultColor;
    this.radius          = radius || this.defaultRadius;
    this.active          = false;
    this.positive        = true;

    this.position        = [this.radius, this.radius];
}

BaseBonus.prototype = Object.create(EventEmitter.prototype);

BaseBonus.prototype.precision      = 1;
BaseBonus.prototype.defaultName    = 'Bonus';
BaseBonus.prototype.defaultColor   = '#7CFC00';
BaseBonus.prototype.defaultRadius  = 1.2;

/**
 * Set Point
 *
 * @param {Array} point
 */
BaseBonus.prototype.setPosition = function(point)
{
    this.position[0] = point[0];
    this.position[1] = point[1];
};

/**
 * Pop
 */
BaseBonus.prototype.pop = function() {
    this.active = true;
};

/**
 * Clear
 *
 * @param {Array} point
 */
BaseBonus.prototype.clear = function()
{
    this.active = false;
};

/**
 * Update
 */
BaseBonus.prototype.update = function() {};

/**
 * http://www.broofa.com/Tools/Math.uuid.htm
 * @returns {Function}
 */
BaseBonus.prototype.generateUUID = function () {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = new Array(36), rnd = 0, r;

    for ( var i = 0; i < 36; i ++ ) {
        if ( i == 8 || i == 13 || i == 18 || i == 23 ) {
            uuid[ i ] = '-';
        } else if ( i == 14 ) {
            uuid[ i ] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }

    return uuid.join('');
};

/**
 * Serialize
 *
 * @returns {{id: *, name: *, color: *, radius: *, active: *, position: *}}
 */
BaseBonus.prototype.serialize = function () {
    return {
        id: this.id,
        name: this.name,
        color: this.color,
        radius: this.radius,
        active: this.active,
        position: this.position
    };
};

/**
 * Unserialize
 *
 * @param bonus
 */
BaseBonus.prototype.unserialize = function (bonus) {
    _.extend(this, bonus);
};