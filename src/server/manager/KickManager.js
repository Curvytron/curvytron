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
    this.room.on('player:leave', this.onPlayerLeave);
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

    var vote = new KickVote(player, this.getTotalClients());

    this.votes.add(vote);
    vote.on('close', this.onVoteClose);

    return vote;
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
};

/**
 * On player leave
 *
 * @param {Object} data
 */
KickManager.prototype.onPlayerLeave = function(data)
{
    var kickVote = this.votes.getById(data.player.id);

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
    for (var i = this.votes.items.length - 1; i >= 0; i--) {
        this.votes.items[i].removeClient(data.client);
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
