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
