/**
 * Distant client
 */
function Client(id)
{
    this.id      = id;
    this.players = new Collection();
    this.active  = true;
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
