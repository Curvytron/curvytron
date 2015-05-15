/**
 * Avatar body
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Avatar} avatar
 */
function AvatarBody(x, y, avatar)
{
    Body.call(this, x, y, avatar.radius, avatar);

    this.num   = avatar.bodyCount++;
    this.birth = new Date().getTime();
}

AvatarBody.prototype = Object.create(Body.prototype);
AvatarBody.prototype.constructor = AvatarBody;

/**
 * Age considered old
 *
 * @type {Number}
 */
AvatarBody.prototype.oldAge = 2000;

/**
 * Match?
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
AvatarBody.prototype.match = function(body)
{
    if ((body instanceof AvatarBody) && this.data.equal(body.data)) {
        return body.num - this.num > this.data.trailLatency;
    }

    return true;
};

/**
 * Is old?
 *
 * @return {Boolean}
 */
AvatarBody.prototype.isOld = function()
{
    return new Date().getTime() - this.birth >= this.oldAge;
};

