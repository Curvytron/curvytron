/**
 * InfluxDB client
 *
 * Writes points in line protocol to the InfluxDB 1.x `/write` endpoint, which
 * InfluxDB 2 also serves for v1 credentials. Replaces the `influx@4` package
 * and its deprecated `request` dependency.
 * Points are timestamped when written and sent in batches, one request per
 * flush. Writes are fire and forget: errors are ignored, as they were before,
 * and a request that hangs is aborted after a timeout.
 *
 * @param {Object} config
 */
function InfluxClient(config)
{
    this.host     = config.host;
    this.port     = config.port || 8086;
    this.auth     = config.username ? config.username + ':' + (config.password || '') : null;
    this.path     = '/write?' + new URLSearchParams({ precision: 'ms', db: config.database }).toString();
    this.lines    = [];
    this.flushing = null;

    this.flush = this.flush.bind(this);
}

/**
 * Delay before sending the pending points, in milliseconds
 *
 * @type {Number}
 */
InfluxClient.prototype.flushDelay = 1000;

/**
 * Number of pending points that triggers an immediate send
 *
 * @type {Number}
 */
InfluxClient.prototype.batchSize = 500;

/**
 * Request timeout, in milliseconds
 *
 * @type {Number}
 */
InfluxClient.prototype.timeout = 5000;

/**
 * Queue a single point
 *
 * @param {String} series
 * @param {Object|Number|String|Boolean} fields
 * @param {Object} tags
 */
InfluxClient.prototype.writePoint = function(series, fields, tags)
{
    var line = this.getLine(series, fields, tags, Date.now());

    if (!line) {
        return;
    }

    this.lines.push(line);

    if (this.lines.length >= this.batchSize) {
        this.flush();
    } else if (!this.flushing) {
        this.flushing = setTimeout(this.flush, this.flushDelay);
        this.flushing.unref();
    }
};

/**
 * Send all pending points
 */
InfluxClient.prototype.flush = function()
{
    clearTimeout(this.flushing);
    this.flushing = null;

    if (this.lines.length) {
        this.write(this.lines.join('\n'));
        this.lines.length = 0;
    }
};

/**
 * Format a point in line protocol, or null when it has no valid field
 *
 * @param {String} series
 * @param {Object|Number|String|Boolean} fields
 * @param {Object} tags
 * @param {Number} timestamp
 *
 * @return {String|null}
 */
InfluxClient.prototype.getLine = function(series, fields, tags, timestamp)
{
    var fieldString = this.getFieldString(fields !== null && typeof fields === 'object' ? fields : { value: fields }),
        tagString = this.getTagString(tags || {});

    if (!fieldString.length) {
        return null;
    }

    return this.escape(series, /[, ]/g) + (tagString.length ? ',' + tagString : '') + ' ' + fieldString + ' ' + timestamp;
};

/**
 * Comma-separated key=value fields, skipping values line protocol can't hold
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
            var value = this.getFieldValue(fields[key]);

            if (value !== null) {
                output.push(this.escape(key, /[,= ]/g) + '=' + value);
            }
        }
    }

    return output.join(',');
};

/**
 * Comma-separated key=value tags, sorted, skipping empty values
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

            if ((typeof value === 'string' && value.length) || (typeof value === 'number' && isFinite(value)) || typeof value === 'boolean') {
                output.push(this.escape(key, /[,= ]/g) + '=' + this.escape(value, /[,= ]/g));
            }
        }
    }

    return output.sort().join(',');
};

/**
 * Format a field value: quoted string, finite number or boolean, null otherwise
 *
 * @param {*} value
 *
 * @return {String|null}
 */
InfluxClient.prototype.getFieldValue = function(value)
{
    switch (typeof value) {
        case 'string':
            return '"' + value.replace(/[\\"]/g, '\\$&').replace(/\r?\n|\r/g, '\\n') + '"';
        case 'number':
            return isFinite(value) ? String(value) : null;
        case 'boolean':
            return String(value);
        default:
            return null;
    }
};

/**
 * Backslash-escape the given characters, replacing line breaks with spaces
 *
 * @param {String} value
 * @param {RegExp} characters
 *
 * @return {String}
 */
InfluxClient.prototype.escape = function(value, characters)
{
    return String(value).replace(/[\r\n]+/g, ' ').replace(characters, '\\$&');
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
        auth: this.auth,
        timeout: this.timeout,
        headers: { 'Content-Length': Buffer.byteLength(body) }
    }, function (response) { response.resume(); });

    request.on('timeout', function () { request.destroy(); });
    request.on('error', function () {});
    request.end(body);
};
