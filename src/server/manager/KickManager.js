/**
 * Kick vote manager
 *
 * @param {RoomController} controller
 */
function KickManager (controller)
{
    this.controller = controller;
    this.room       = this.controller.room;
    this.votes      = new Collection();

    this.updateVotes   = this.updateVotes.bind(this);
    this.onClientLeave = this.onClientLeave.bind(this);
    this.onPlayerLeave = this.onPlayerLeave.bind(this);
    this.onVoteClose   = this.onVoteClose.bind(this);
    this.clear         = this.clear.bind(this);

    this.controller.on('client:add', this.updateVotes);
    this.controller.on('client:remove', this.onClientLeave);
    this.controller.on('player:add', this.updateVotes);
    this.controller.on('player:remove', this.onPlayerLeave);
    this.room.on('game:new', this.clear);
}

KickManager.prototype = Object.create(EventEmitter.prototype);
KickManager.prototype.constructor = KickManager;

/**
 * Vote
 *
 * @param {SocketClient} client
 * @param {Player} player
 */
KickManager.prototype.vote = function(client, player)
{
    return this.getVote(player).toggleVote(client);
};

/**
 * Get vote for the given player
 *
 * @param {Player} player
 */
KickManager.prototype.getVote = function(player)
{
    if (this.votes.indexExists(player.id)) {
        return this.votes.getById(player.id);
    }

    var kickVote = new KickVote(player, this.getTotalClients());

    this.votes.add(kickVote);
    kickVote.on('close', this.onVoteClose);
    this.emit('vote:new', kickVote);

    return kickVote;
};

/**
 * On vote close
 *
 * @param {KickVote} kickVote
 */
KickManager.prototype.onVoteClose = function(kickVote)
{
    kickVote.removeListener('close', this.onVoteClose);
    this.votes.remove(kickVote);

    if (kickVote.result) {
        this.emit('kick', kickVote.target);
    }

    this.emit('vote:close', kickVote);
};

/**
 * On player leave
 *
 * @param {Object} data
 */
KickManager.prototype.onPlayerLeave = function(data)
{
    var player = data.player,
        kickVote = this.votes.getById(player.id);

    if (kickVote) {
        kickVote.close();
    }
};

/**
 * On player leave
 *
 * @param {Object} data
 */
KickManager.prototype.onClientLeave = function(data)
{
    this.removeClient(data.client);
};

/**
 * Remove client
 *
 * @param {SocketClient} client
 */
KickManager.prototype.removeClient = function(client)
{
    var total = this.getTotalClients(),
        kickVote;

    for (var i = this.votes.items.length - 1; i >= 0; i--) {
        kickVote = this.votes.items[i];

        if (kickVote) {
            kickVote.removeClient(client);
            kickVote.setTotal(total);
        }
    }
};

/**
 * Get total clients
 *
 * @return {Number}
 */
KickManager.prototype.getTotalClients = function()
{
    return this.controller.clients.filter(function () { return this.isPlaying(); }).count();
};

/**
 * Update votes
 */
KickManager.prototype.updateVotes = function()
{
    var total = this.getTotalClients();

    for (var i = this.votes.items.length - 1; i >= 0; i--) {
        this.votes.items[i].setTotal(total);
    }
};

/**
 * Clear
 */
KickManager.prototype.clear = function()
{
    for (var i = this.votes.items.length - 1; i >= 0; i--) {
        this.votes.items[i].removeListener('close', this.onVoteClose);
    }

    this.votes.clear();
};
