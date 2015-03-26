/**
 * Data compressor / decompressor for transport
 */
function Compressor() {}

/**
 * Float precision
 *
 * @type {Number}
 */
Compressor.prototype.precision = 100;

/**
 * Compress an array of floats into integers
 *
 * @param {Float} x
 * @param {Float} y
 *
 * @return {Array}
 */
Compressor.prototype.compressPosition = function(x, y)
{
    return [this.compress(x), this.compress(y)];
};

/**
 * Compress a float into an integer
 *
 * @param {Float} value
 *
 * @return {Integer}
 */
Compressor.prototype.compress = function(value)
{
    return (0.5 + value * this.precision) | 0;
};

/**
 * Decompress an array of floats into integers
 *
 * @param {Float} x
 * @param {Float} y
 *
 * @return {Array}
 */
Compressor.prototype.decompressPosition = function(x, y)
{
    return [this.decompress(x), this.decompress(y)];
};

/**
 * Decompress an integer into an float
 *
 * @param {Integer} value
 *
 * @return {Float}
 */
Compressor.prototype.decompress = function(value)
{
    return value / this.precision;
};
