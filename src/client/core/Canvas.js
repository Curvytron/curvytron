/**
 * Canvas
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Element} element
 */
function Canvas(width, height, element)
{
    this.element = typeof(element) !== 'undefined' ? element : document.createElement('canvas');
    this.context = this.element.getContext('2d');
    this.scale   = 1;

    if (typeof(width) !== 'undefined' && width) {
        this.setWidth(width);
    }

    if (typeof(height) !== 'undefined' && height) {
        this.setHeight(height);
    }
}

/**
 * Set width
 *
 * @param {Number} width
 */
Canvas.prototype.setWidth = function(width)
{
    this.element.width = width;
};

/**
 * Set height
 *
 * @param {Number} height
 */
Canvas.prototype.setHeight = function(height)
{
    this.element.height = height;
};

/**
 * Set scale
 *
 * @param {Float} scale
 */
Canvas.prototype.setScale = function(scale)
{
    this.scale = scale;
};

/**
 * Set dimension
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Number} scale
 */
Canvas.prototype.setDimension = function(width, height, scale)
{
    this.element.width  = width;
    this.element.height = height;

    if (typeof(scale) != 'undefined') {
        this.setScale(scale);
    }
};

/**
 * Clear
 */
Canvas.prototype.clear = function()
{
    this.context.clearRect(0, 0, this.element.width, this.element.height);
};

/**
 * Save context
 */
Canvas.prototype.save = function()
{
    this.context.save();
};

/**
 * Restore context
 */
Canvas.prototype.restore = function()
{
    this.context.restore();
};

/**
 * Reverse image
 */
Canvas.prototype.reverse = function()
{
    this.context.save();
    this.context.translate(this.element.width, 0);
    this.context.scale(-1, 1);
};

/**
 * Draw image
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 */
Canvas.prototype.drawImage = function(image, x, y)
{
    this.context.drawImage(image, this.round(x), this.round(y));
};

/**
 * Draw image to scale
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Number} angle
 */
Canvas.prototype.drawImageScaled = function(image, x, y, width, height, angle)
{
    this.drawImageSized(image, x * this.scale, y * this.scale, width * this.scale, height * this.scale, angle);
};

/**
 * Draw image to size
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Number} angle
 */
Canvas.prototype.drawImageSized = function(image, x, y, width, height, angle)
{
    x = this.round(x);
    y = this.round(y);
    width = this.round(width);
    height = this.round(height);
    angle = typeof(angle) !== 'undefined' && angle ? this.roundFloat(angle) : false;

    if (angle) {
        var centerX = x + width/2,
            centerY = y + height/2;

        x = -width/2;
        y = -height/2;

        this.context.save();
        this.context.translate(centerX, centerY);
        this.context.rotate(angle);
    }

    this.context.drawImage(image, x, y, width, height);

    if (angle) {
        this.context.restore();
    }
};

/**
 * Draw circle
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 * @param {String} fill
 * @param {String} stroke
 * @param {Number} alpha
 */
Canvas.prototype.drawCircle = function(x, y, radius, fill, stroke, alpha)
{
    if (typeof(alpha) != 'undefined') {
        var previous = this.context.globalAlpha;
        this.context.globalAlpha = alpha;
    }

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI, false);

    if (typeof(fill) != 'undefined') {
        this.context.fillStyle = fill;
        this.context.fill();
    }

    if (typeof(stroke) != 'undefined') {
        this.context.lineWidth = 1;
        this.context.strokeStyle = stroke;
        this.context.stroke();
    }

    if (typeof(alpha) != 'undefined') {
        this.context.globalAlpha = previous;
    }
};

/**
 * Draw line
 *
 * @param {Array} points
 * @param {Number} width
 * @param {String} color
 * @param {Number} alpha
 */
Canvas.prototype.drawLine = function(points, width, color, alpha)
{
    var length = points.length;

    if (length > 1) {
        if (typeof(alpha) != 'undefined') {
            var previous = this.context.globalAlpha;
            this.context.globalAlpha = alpha;
        }

        if (typeof(color) != 'undefined') {
            this.context.strokeStyle = color;
        }

        this.context.lineWidth = typeof(width) !== 'undefined' ? width : 1;

        this.context.beginPath();
        this.context.moveTo(this.round(points[0][0]), this.round(points[0][1]));

        for (var i = 1; i < length; i++) {
            this.context.lineTo(this.round(points[i][0]), this.round(points[i][1]));
        }

        this.context.stroke();

        if (typeof(alpha) != 'undefined') {
            this.context.globalAlpha = previous;
        }
    }
};

/**
 * Draw line scaled
 *
 * @param {Array} points
 * @param {Number} width
 * @param {String} color
 * @param {Number} alpha
 */
Canvas.prototype.drawLineScaled = function(points, width, color, alpha)
{
    var scaledPoints = [];

    for (var i = points.length - 1; i >= 0; i--) {
        scaledPoints[i] = [points[i][0] * this.scale, points[i][1] * this.scale];
    }

    this.drawLine(scaledPoints, width, color, alpha);
};

/**
 * Round
 *
 * @param {Number} value
 *
 * @return {Number}
 */
Canvas.prototype.round = function (value) {
    return (0.5 + value) | 0;
};

/**
 * Round float
 *
 * @param {Float} value
 * @param {Number} precision
 *
 * @return {Float}
 */
Canvas.prototype.roundFloat = function (value, precision) {
    precision = typeof(precision) != 'undefined' ? precision : 2;

    var coef = Math.pow(10, precision);

    return ((0.5 + value*coef) | 0)/coef;
};