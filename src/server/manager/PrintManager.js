/**
 * Print Manager
 *
 * @param {Avatar} avatar
 */
function PrintManager(avatar)
{
    this.avatar    = avatar;
    this.active    = false;
    this.lastPoint = new Array(2);
    this.distance  = 0;

    this.start = this.start.bind(this);
}

PrintManager.prototype.holeDistance  = 5;
PrintManager.prototype.printDistance = 60;

/**
 * Toggle print
 */
PrintManager.prototype.togglePrinting = function()
{
    this.setPrinting(!this.avatar.printing);
};

/**
 * Set print
 */
PrintManager.prototype.setPrinting = function(printing)
{
    this.avatar.setPrinting(printing);
    this.distance = this.getRandomDistance();
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
PrintManager.prototype.getRandomDistance = function()
{
    if (this.avatar.printing) {
        return this.printDistance * (0.3 + Math.random() * 0.7);
    } else {
        return this.holeDistance * (0.8 + Math.random() * 0.5);
    }
};

/**
 * Start
 */
PrintManager.prototype.start = function()
{
    if (!this.active) {
        this.active    = true;
        this.lastPoint = this.avatar.head.slice(0);

        this.setPrinting(true);
    }
};

/**
 * Stop
 */
PrintManager.prototype.stop = function()
{
    if (this.active) {
        this.active = false;
        this.setPrinting(false);
        this.clear();
    }
};

/**
 * Test
 */
PrintManager.prototype.test = function()
{
    if (this.active) {

        var diff = this.getDistance(this.lastPoint, this.avatar.head);

        this.distance -= diff;
        this.lastPoint = this.avatar.head.slice(0);

        if (this.distance <= 0) {
            this.togglePrinting();
        }
    }

};

/**
 * Get Distance
 *
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Number}
 */
PrintManager.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};

/**
 * Clear
 */
PrintManager.prototype.clear = function()
{
    this.active    = false;
    this.distance  = 0;
    this.lastPoint = new Array(2);
};