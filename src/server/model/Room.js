/**
 * Room
 *
 * @param {String} name
 */
function Room(name)
{
    BaseRoom.call(this, name);

    this.clients = new Collection();
    this.client  = new SocketGroup(this.clients);
}

Room.prototype = Object.create(BaseRoom.prototype);
Room.prototype.constructor = Room;

/**
 * Add client
 *
 * @param {Client} client
 */
Room.prototype.addClient = function(client)
{
    if (this.clients.add(client)) {
        client.room = this;
    }
};

/**
 * Remove client
 *
 * @param {Client} client
 */
Room.prototype.removeClient = function(client)
{
    if (this.clients.remove(client)) {
        client.room = null;
    }
};