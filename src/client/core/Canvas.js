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
Canvas.prototype.setDimension = function(width, height, scale, update)
{
    var save;

    width  = Math.ceil(width);
    height = Math.ceil(height);

    if (update) {
        save = new Canvas(this.element.width, this.element.height);
        save.drawImage(this.element, [0,0]);
    }

    this.element.width  = width;
    this.element.height = height;

    if (typeof(scale) !== 'undefined') {
        this.setScale(scale);
    }

    if (update) {
        this.drawImage(save.element, [0,0], this.element.width, this.element.height);
        save = null;
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
 * Color
 */
Canvas.prototype.color = function(color)
{
    this.context.beginPath();
    this.context.rect(0, 0, this.element.width, this.element.height);
    this.context.fillStyle = color;
    this.context.fill();
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
 * Draw image to scale
 *
 * @param {Resource} image
 * @param {Array} position
 * @param {Number} width
 * @param {Number} height
 * @param {Number} angle
 */
Canvas.prototype.drawImageScaled = function(image, position, width, height, angle, opacity)
{
    this.drawImage(image, [position[0] * this.scale, position[1] * this.scale], width * this.scale, height * this.scale, angle, opacity);
};

/**
 * Draw image to size
 *
 * @param {Resource} image
 * @param {Aray} position
 * @param {Number} width
 * @param {Number} height
 * @param {Number} angle
 */
Canvas.prototype.drawImage = function(image, position, width, height, angle, opacity)
{
    position = typeof(position) !== 'undefined' && position ? position : [0, 0];
    angle = typeof(angle) !== 'undefined' && angle ? angle : false;
    opacity = typeof(opacity) !== 'undefined' && opacity ? opacity : 1;

    if (angle) {
        var centerX = position[0] + width/2,
            centerY = position[1] + height/2;

        position[0] = -width/2;
        position[1] = -height/2;

        this.context.save();
        this.context.translate(centerX, centerY);
        this.context.rotate(angle);
    }

    this.context.globalAlpha = opacity;

    if (typeof(width) === 'number' && typeof(height) === 'number') {
        this.context.drawImage(image, this.round(position[0]), this.round(position[1]), this.round(width), this.round(height));
    } else {
        this.context.drawImage(image, this.round(position[0]), this.round(position[1]));
    }

    if (angle) {
        this.context.restore();
    }
};

/**
 * Draw circle
 *
 * @param {Array} position
 * @param {Number} radius
 * @param {String} fill
 * @param {String} stroke
 * @param {Number} alpha
 */
Canvas.prototype.drawCircle = function(position, radius, fill, stroke, alpha)
{
    var previous;

    if (typeof(alpha) !== 'undefined') {
        previous = this.context.globalAlpha;
        this.context.globalAlpha = alpha;
    }

    this.context.beginPath();
    this.context.arc(position[0], position[1], radius, 0, 2 * Math.PI, false);

    if (typeof(fill) !== 'undefined' && fill !== null) {
        this.context.fillStyle = fill;
        this.context.fill();
    }

    if (typeof(stroke) !== 'undefined' && stroke !== null) {
        this.context.lineWidth = 1;
        this.context.strokeStyle = stroke;
        this.context.stroke();
    }

    if (typeof(alpha) !== 'undefined' && alpha !== null) {
        this.context.globalAlpha = previous;
    }
};

/**
 * Draw circle scaled
 *
 * @param {Array} position
 * @param {Number} radius
 * @param {String} fill
 * @param {String} stroke
 * @param {Number} alpha
 */
Canvas.prototype.drawCircleScaled = function(position, radius, fill, stroke, alpha)
{
    position = [position[0] * this.scale, position[1] * this.scale];
    radius   = radius * this.scale;

    this.drawCircle(position, radius, fill, stroke, alpha);
}

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
    var length = points.length,
        previous;

    if (length > 1) {
        if (typeof(alpha) !== 'undefined') {
            previous = this.context.globalAlpha;
            this.context.globalAlpha = alpha;
        }

        if (typeof(color) !== 'undefined') {
            this.context.strokeStyle = color;
        }

        this.context.lineWidth = typeof(width) !== 'undefined' ? width : 1;
        this.context.lineCap = 'round';
        this.context.beginPath();
        this.context.moveTo(points[0][0], points[0][1]);

        for (var i = 1; i < length; i++) {
            this.context.lineTo(points[i][0], points[i][1]);
        }

        this.context.stroke();

        if (typeof(alpha) !== 'undefined') {
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
    for (var i = points.length - 1; i >= 0; i--) {
        points[i] = [points[i][0] * this.scale, points[i][1] * this.scale];
    }

    this.drawLine(points, width * this.scale, color, alpha);
};

/**
 * To string
 *
 * @return {String}
 */
Canvas.prototype.toString = function()
{
    return this.element.toDataURL();
};

/**
 * Round
 *
 * @param {Number} value
 *
 * @return {Number}
 */
Canvas.prototype.round = function (value)
{
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
Canvas.prototype.roundFloat = function (value, precision)
{
    var coef = Math.pow(10, typeof(precision) !== 'undefined' ? precision : 2);

    return ((0.5 + value*coef) | 0)/coef;
};