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
 * Two pi
 *
 * @type {Number}
 */
Canvas.prototype.twoPi = 2 * Math.PI;

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
        save.pastImage(this.element);
    }

    this.element.width  = width;
    this.element.height = height;

    if (typeof(scale) !== 'undefined') {
        this.setScale(scale);
    }

    if (update) {
        this.drawImage(save.element, 0, 0, this.element.width, this.element.height);
        save = null;
    }
};

/**
 * Set opacity
 *
 * @param {Float} opacity
 */
Canvas.prototype.setOpacity = function(opacity) {
    this.context.globalAlpha = opacity;
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
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.element.width, this.element.height);
};

/**
 * Clear rectangular zone
 */
Canvas.prototype.clearZone = function(x, y, width, height)
{
    this.context.clearRect(x, y, width, height);
};

/**
 * Clear rectangular zone scaled
 */
Canvas.prototype.clearZoneScaled = function(x, y, width, height)
{
    this.clearZone(
        this.round(x * this.scale),
        this.round(y * this.scale),
        this.round(width * this.scale),
        this.round(height * this.scale)
    );
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
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 */
Canvas.prototype.drawImageScaled = function(image, x, y, width, height)
{
    this.context.drawImage(
        image,
        this.round(x * this.scale),
        this.round(y * this.scale),
        this.round(width * this.scale),
        this.round(height * this.scale)
    );
};

/**
 * Draw image to scale
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Float} angle
 */
Canvas.prototype.drawImageScaledAngle = function(image, x, y, width, height, angle)
{
    x      = this.round(x * this.scale);
    y      = this.round(y * this.scale);
    width  = this.round(width / 2 * this.scale);
    height = this.round(height / 2 * this.scale);

    var centerX = x + width,
        centerY = y + height;

    x = -width;
    y = -height;

    this.context.save();
    this.context.translate(centerX, centerY);
    this.context.rotate(angle);
    this.context.drawImage(image, x, y, width * 2, height * 2);
    this.context.restore();
};

/**
 * Draw image to size
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 */
Canvas.prototype.drawImage = function(image, x, y, width, height)
{
    this.context.drawImage(image, x, y, width, height);
};

/**
 * Draw image to size
 *
 * @param {Resource} image
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 */
Canvas.prototype.drawImageTo = function(image, x, y)
{
    this.context.drawImage(image, x, y);
};

/**
 * Past image
 *
 * @param {Resource} image
 */
Canvas.prototype.pastImage = function(image)
{
    this.context.drawImage(image, 0, 0);
};

/**
 * Draw circle
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 * @param {String} color
 */
Canvas.prototype.drawCircle = function(x, y, radius, color)
{
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, this.twoPi, false);
    this.context.fillStyle = color;
    this.context.fill();
};

/**
 * Draw line
 *
 * @param {Array} points
 * @param {Number} width
 * @param {String} color
 * @param {String} style
 */
Canvas.prototype.drawLine = function(points, width, color, style)
{
    var length = points.length;

    if (length > 1) {
        this.context.lineCap     = style;
        this.context.strokeStyle = color;
        this.context.lineWidth   = width;
        this.context.beginPath();
        this.context.moveTo(points[0][0], points[0][1]);

        for (var i = 1; i < length; i++) {
            this.context.lineTo(points[i][0], points[i][1]);
        }

        this.context.stroke();
    }
};

/**
 * Draw line scaled
 *
 * @param {Array} points
 * @param {Number} width
 * @param {String} color
 * @param {String} style
 */
Canvas.prototype.drawLineScaled = function(points, width, color, style)
{
    var length = points.length;

    if (length > 1) {
        this.context.lineCap     = style;
        this.context.strokeStyle = color;
        this.context.lineWidth   = width * this.scale;
        this.context.beginPath();
        this.context.moveTo(points[0][0] * this.scale, points[0][1] * this.scale);

        for (var i = 1; i < length; i++) {
            this.context.lineTo(points[i][0] * this.scale, points[i][1] * this.scale);
        }

        this.context.stroke();
    }
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
