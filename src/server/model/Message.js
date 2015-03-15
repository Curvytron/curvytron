/**
 * Message
 *
 * @param {String} content
 * @param {SocketClient} client
 */
function Message (content, client)
{
    BaseMessage.call(this, content);

    this.client = client;
    this.name   = null;
    this.color  = null;

    this.buildPlayer();
}

Message.prototype = Object.create(BaseMessage.prototype);
Message.prototype.constructor = Message;

/**
 * Build player
 */
Message.prototype.buildPlayer = function()
{
    var player = this.client.players.getFirst();

    if (player) {
        this.name  = player.name;
        this.color = player.color;
    }
};

/**
 * Serialize
 *
 * @return {Object}
 */
Message.prototype.serialize = function()
{
    var data = BaseMessage.prototype.serialize.call(this);

    if (this.name === null) {
        this.buildPlayer();
    }

    data.client = this.client.id;
    data.name   = this.name;
    data.color  = this.color;

    return data;
};
