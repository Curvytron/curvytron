/**
 * Client tracker
 *
 * @param {Inspector} inspector
 * @param {Client} client
 */
function ClientTracker (inspector, client)
{
    Tracker.call(this, inspector, client.id);

    this.client = client;
    this.ip     = client.ip;

    this.onLatency = this.onLatency.bind(this);

    this.client.on('latency', this.onLatency);
}

ClientTracker.prototype = Object.create(Tracker.prototype);
ClientTracker.prototype.constructor = ClientTracker;

/**
 * On latency
 *
 * @param {Number} latency
 */
ClientTracker.prototype.onLatency = function(latency)
{
    this.emit('latency', {tracker: this, latency: latency});
};

/**
 * @inheritDoc
 */
ClientTracker.prototype.serialize = function()
{
    var data = Tracker.prototype.serialize.call(this);

    data.ip = md5(this.ip);

    return data;
};
