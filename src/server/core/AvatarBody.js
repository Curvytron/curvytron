/**
 * Avatar body
 */
function AvatarBody(point, avatar)
{
    Body.call(this, point, avatar.radius);

    avatar.bodyCount++;

    this.id      = avatar.bodyCount;
    this.avatar  = avatar;
    this.created = new Date();
}

AvatarBody.prototype = Object.create(Body.prototype);

/**
 * Match?
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
AvatarBody.prototype.match = function(body)
{
    if (body instanceof AvatarBody && this.avatar.equal(body.avatar)) {
        return this.avatar.bodyCount - this.id > this.avatar.trailLatency;
    }

    return Body.prototype.match.call(this, body);
};