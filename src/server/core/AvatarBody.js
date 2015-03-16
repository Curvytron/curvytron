/**
 * Avatar body
 */
function AvatarBody(point, avatar)
{
    Body.call(this, point, avatar.radius);

    avatar.bodyCount++;

    this.num    = avatar.bodyCount;
    this.avatar = avatar;
}

AvatarBody.prototype = Object.create(Body.prototype);
AvatarBody.prototype.constructor = AvatarBody;

/**
 * Match?
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
AvatarBody.prototype.match = function(body)
{
    if ((body instanceof AvatarBody) && this.avatar.equal(body.avatar)) {
        return body.num - this.num > this.avatar.trailLatency;
    }

    return Body.prototype.match.call(this, body);
};

/**
 * Is old
 *
 * @return {Boolean}
 */
AvatarBody.prototype.isOld = function()
{
    return this.num - this.avatar.bodyCount > this.avatar.trailLatency;
};

