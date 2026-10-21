/**
 * InfluxDB client
 *
 * Writes points in line protocol to the InfluxDB 1.x `/write` endpoint, which
 * InfluxDB 2 also serves for v1 credentials. Same requests as the `influx@4`
 * package it replaces (`u`/`p` query auth, millisecond precision, timestamps
 * set by the server), without its deprecated `request` dependency.
 * Writes are fire and forget: errors are ignored, as they were before.
 *
 * @param {Object} config
 */
function InfluxClient(config)
{
    this.host = config.host;
    this.port = config.port || 8086;
    this.path = '/write?' + new URLSearchParams({
        u: config.username,
        p: config.password,
        precision: 'ms',
        db: config.database
    }).toString();
}

/**
 * Write a single point
 *
 * @param {String} series
 * @param {Object|Number|String} fields
 * @param {Object} tags
 */
InfluxClient.prototype.writePoint = function(series, fields, tags)
{
    this.write(this.getLine(series, fields, tags));
};

/**
 * Format a point in line protocol
 *
 * @param {String} series
 * @param {Object|Number|String} fields
 * @param {Object} tags
 *
 * @return {String}
 */
InfluxClient.prototype.getLine = function(series, fields, tags)
{
    var line = series.replace(/ /g, '\\ ').replace(/,/g, '\\,'),
        tagString = this.getTagString(tags || {});

    if (tagString.length) {
        line += ',' + tagString;
    }

    if (fields !== null && typeof fields === 'object') {
        return line + ' ' + this.getFieldString(fields);
    }

    return line + (typeof fields === 'string' ? ' value="' + fields + '"' : ' value=' + fields);
};

/**
 * Comma-separated key=value fields, string values quoted
 *
 * @param {Object} fields
 *
 * @return {String}
 */
InfluxClient.prototype.getFieldString = function(fields)
{
    var output = [];

    for (var key in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
            var value = fields[key];

            output.push(this.escape(key) + '=' + (typeof value === 'string' ? '"' + value.replace(/"/g, '\\"') + '"' : value));
        }
    }

    return output.join(',');
};

/**
 * Comma-separated key=value tags, sorted, string values escaped
 *
 * @param {Object} tags
 *
 * @return {String}
 */
InfluxClient.prototype.getTagString = function(tags)
{
    var output = [];

    for (var key in tags) {
        if (Object.prototype.hasOwnProperty.call(tags, key)) {
            var value = tags[key];

            output.push(this.escape(key) + '=' + (typeof value === 'string' ? this.escape(value) : value));
        }
    }

    return output.sort().join(',');
};

/**
 * Backslash-escape commas, equal signs and spaces
 *
 * @param {String} value
 *
 * @return {String}
 */
InfluxClient.prototype.escape = function(value)
{
    return value.replace(/[,= ]/g, '\\$&');
};

/**
 * POST a body to the write endpoint
 *
 * @param {String} body
 */
InfluxClient.prototype.write = function(body)
{
    var request = http.request({
        method: 'POST',
        host: this.host,
        port: this.port,
        path: this.path,
        headers: { 'Content-Length': Buffer.byteLength(body) }
    }, function (response) { response.resume(); });

    request.on('error', function () {});
    request.end(body);
};
