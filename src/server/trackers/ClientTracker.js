/**
 * Client tracker
 *
 * @param {Client} client
 */
function ClientTracker (client)
{
    Tracker.call(this, client.id);
}

ClientTracker.prototype = Object.create(Tracker.prototype);
ClientTracker.prototype.constructor = ClientTracker;
