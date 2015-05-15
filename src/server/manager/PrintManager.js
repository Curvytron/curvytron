/**
 * Print Manager
 *
 * @param {Avatar} avatar
 */
function PrintManager(avatar)
{
    this.avatar   = avatar;
    this.active   = false;
    this.lastX    = 0;
    this.lastY    = 0;
    this.distance = 0;

    this.start = this.start.bind(this);
}

/**
 * Hole distance
 *
 * @type {Number}
 */
PrintManager.prototype.holeDistance  = 5;

/**
 * Print distance
 *
 * @type {Number}
 */
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
        this.active = true;
        this.lastX  = this.avatar.x;
        this.lastY  = this.avatar.y;
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
        this.distance -= this.getDistance(this.lastX, this.lastY, this.avatar.x, this.avatar.y);

        this.lastX = this.avatar.x;
        this.lastY = this.avatar.y;

        if (this.distance <= 0) {
            this.togglePrinting();
        }
    }

};

/**
 * Get distance
 *
 * @param {Number} fromX
 * @param {Number} fromY
 * @param {Number} toX
 * @param {Number} toY
 *
 * @return {Number}
 */
PrintManager.prototype.getDistance = function(fromX, fromY, toX, toY)
{
    return Math.sqrt(Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2));
};

/**
 * Clear
 */
PrintManager.prototype.clear = function()
{
    this.active   = false;
    this.distance = 0;
    this.lastX    = 0;
    this.lastY    = 0;
};
