/**
 * Kick vote
 *
 * @param {Player} player
 * @param {Number} total
 */
function KickVote(player, total)
{
    this.id      = player.id;
    this.target  = player;
    this.votes   = new Collection();
    this.total   = parseInt(total, 10);
    this.closed  = false;
    this.result  = false;
    this.timeout = null;

    this.close = this.close.bind(this);
}

KickVote.prototype = Object.create(EventEmitter.prototype);
KickVote.prototype.constructor = KickVote;

/**
 * Time before an empty vote is closed
 *
 * @type {Number}
 */
KickVote.prototype.timeToClose = 10000;

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
    var result = this.votes.remove(client);

    this.check();

    return result;
};

/**
 * Check
 */
KickVote.prototype.check = function()
{
    if (this.closed) { return; }

    if (this.timeout) {
        clearTimeout(this.timeout);
    }

    if (this.votes.count() > this.total/2) {
        this.result = true;
        this.close();
    } else if (this.votes.isEmpty()) {
        this.timeout = setTimeout(this.close, this.timeToClose);
    }
};

/**
 * Close the vote
 */
KickVote.prototype.close = function ()
{
    this.closed = true;
    this.votes.clear();
    this.emit('close', this);
};

/**
 * Has vote
 *
 * @param {SocketClient} client
 *
 * @return {Boolean}
 */
KickVote.prototype.hasVote = function(client)
{
    return this.votes.exists(client);
};

/**
 * Serialize
 *
 * @return {Object}
 */
KickVote.prototype.serialize = function()
{
    return {
        target: this.target.id,
        result: this.result
    };
};
