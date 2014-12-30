/**
 * Kick vote
 *
 * @param {Player} player
 * @param {Number} total
 */
function KickVote(player, total)
{
    this.id     = player.id;
    this.target = player;
    this.votes  = new Collection();
    this.total  = parseInt(total);
    this.closed = false;
    this.result = false;
}

KickVote.prototype = Object.create(EventEmitter.prototype);
KickVote.prototype.constructor = KickVote;

/**
 * Set total
 *
 * @param {Number} total
 */
KickVote.prototype.setTotal = function(total)
{
    if (this.closed) { return this; }

    this.total = total;

    this.check();

    return this;
};

/**
 * Toggle vote
 *
 * @param {Client} client
 */
KickVote.prototype.toggleVote = function(client)
{
    if (this.closed) { return this; }

    if (this.hasVote(client)) {
        this.votes.remove(client);
    } else {
        this.votes.add(client);
    }

    this.check();

    return this;
};

/**
 * Remove client
 *
 * @param {SocketClient} client
 */
KickVote.prototype.removeClient = function(client)
{
    return this.votes.remove(client);
};

/**
 * Check
 */
KickVote.prototype.check = function()
{
    if (this.closed) { return; }

    if (this.votes.count() > this.total/2) {
        this.result = true;
        this.close();
    }
};

/**
 * Close the vote
 */
KickVote.prototype.close = function (success)
{
    this.closed = true;
    this.votes.clear();
    this.emit('close', this);
};

/**
 * Hase vote
 *
 * @param {SocketClient} client
 *
 * @return {Boolean}
 */
KickVote.prototype.hasVote = function(client)
{
    return this.votes.exists(client);
};
