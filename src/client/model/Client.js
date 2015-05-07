/**
 * Distant client
 */
function Client(id, active)
{
    this.id      = id;
    this.players = new Collection();
    this.active  = typeof(active) === 'undefined' || active;
    this.master  = false;
}

/**
 * Set master
 *
 * @param {boolean} master
 */
Client.prototype.setMaster = function(master)
{
    this.master = master;
};
