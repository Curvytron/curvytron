/**
 * Tracker
 *
 * @param {Inspector} inspector
 * @param {String} id
 */
function Tracker (inspector, id)
{
    EventEmitter.call(this);

    this.inspector = inspector;
    this.id        = id;
    this.creation  = new Date().getTime();
    this.uniqId    = md5(this.creation + '-' + this.id);
}

Tracker.prototype = Object.create(EventEmitter.prototype);
Tracker.prototype.constructor = Tracker;

/**
 * Destroy tracker
 *
 * @return {Tracker}
 */
Tracker.prototype.destroy = function()
{
    return this;
};

/**
 * Get duration
 *
 * @return {Number}
 */
Tracker.prototype.getDuration = function()
{
    return new Date().getTime() - this.creation;
};

/**
 * Object version of the tracker
 *
 * @return {Object}
 */
Tracker.prototype.getValues = function()
{
    return {
        mesuredDuration: this.getDuration(),
        id: this.uniqId
    };
};

/**
 * Get tags
 *
 * @return {Object}
 */
Tracker.prototype.getTags = function()
{
    return {};
};
