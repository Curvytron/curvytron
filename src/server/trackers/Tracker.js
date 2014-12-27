/**
 * Tracker
 *
 * @param {String} id
 */
function Tracker (id)
{
    this.id       = id;
    this.creation = new Date();
}

/**
 * Get duration
 *
 * @return {Number}
 */
Tracker.prototype.getDuration = function()
{
    return new Date() - this.creation;
};
