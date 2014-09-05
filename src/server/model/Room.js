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
        client.players.clear();
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

        for (var i = client.players.items.length - 1; i >= 0; i--) {
            player = client.players.items[i];
            this.removePlayer(player);
        }

        client.players.clear();
    }
};

/**
 * Remove player
 *
 * @param {Player} player
 */
Room.prototype.removePlayer = function(player)
{
    var result = BaseRoom.prototype.removePlayer.call(this, player);

    if (result) {
        this.emit('player:leave', {room: this, player: player});
    }

    return result;
};