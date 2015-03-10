/**
 * Client tracker
 *
 * @param {Inspector} inspector
 * @param {Client} client
 */
function ClientTracker (inspector, client)
{
    Tracker.call(this, inspector, client.id);

    this.ip = client.ip;
}

ClientTracker.prototype = Object.create(Tracker.prototype);
ClientTracker.prototype.constructor = ClientTracker;

/**
 * @inheritDoc
 */
ClientTracker.prototype.serialize = function()
{
    var data = Tracker.prototype.serialize.call(this);

    data.ip = this.ip;

    return data;
};
