/**
 * Client tracker
 *
 * @param {Inspector} inspector
 * @param {Client} client
 */
function ClientTracker (inspector, client)
{
    Tracker.call(this, inspector, client.id);
}

ClientTracker.prototype = Object.create(Tracker.prototype);
ClientTracker.prototype.constructor = ClientTracker;
