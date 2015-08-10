/**
 * Chat system
 *
 * @param {SocketClient} client
 * @param {RoomRepository} repository
 */
function Chat(client, repository)
{
    BaseChat.call(this);

    this.messages.index = false;

    this.client     = client;
    this.repository = repository;
    this.message    = new MessagePlayer(this.client);
    this.room       = null;
    this.element    = null;
    this.auto       = true;
    this.sources    = new Collection([], 'id', true);
    this.muted      = [];

    this.talk         = this.talk.bind(this);
    this.onTalk       = this.onTalk.bind(this);
    this.onVoteNew    = this.onVoteNew.bind(this);
    this.onKick       = this.onKick.bind(this);
    this.onRoomMaster = this.onRoomMaster.bind(this);
    this.scrollDown   = this.scrollDown.bind(this);
    this.onActivity   = this.onActivity.bind(this);
    this.setRoom      = this.setRoom.bind(this);

    this.attachEvents();
}

Chat.prototype = Object.create(BaseChat.prototype);
Chat.prototype.constructor = Chat;

/**
 * Attach events
 */
Chat.prototype.attachEvents = function()
{
    this.client.on('room:talk', this.onTalk);
    this.repository.on('room:join', this.setRoom);
    this.repository.on('room:leave', this.setRoom);
    this.repository.on('vote:new', this.onVoteNew);
    this.repository.on('room:kick', this.onKick);
    this.repository.on('room:master', this.onRoomMaster);
};

/**
 * Detach events
 */
Chat.prototype.detachEvents = function()
{
    this.client.off('room:talk', this.onTalk);
    this.repository.off('room:join', this.setRoom);
    this.repository.off('room:leave', this.setRoom);
    this.repository.off('vote:new', this.onVoteNew);
    this.repository.off('room:kick', this.onKick);
    this.repository.off('room:master', this.onRoomMaster);
};

/**
 * Set player
 *
 * @param {Player} player
 */
Chat.prototype.setPlayer = function(player)
{
    if (this.room) {
        this.message.player = player;
    }
};

/**
 * Set room
 *
 * @param {Room} room
 */
Chat.prototype.setRoom = function()
{
    this.room = this.repository.room;

    if (this.room) {
        this.clearMessages();
    } else {
        this.clear();
    }
};

/**
 * Set DOM element
 */
Chat.prototype.setElement = function(element)
{
    this.element = element;
    this.element.addEventListener('scroll', this.onActivity);
    setTimeout(this.scrollDown, 0);
};

/**
 * Add message
 *
 * @param {Message} message
 */
Chat.prototype.addMessage = function(message)
{
    this.sources.add(message);

    if (BaseChat.prototype.addMessage.call(this, message) && this.auto) {
        this.scrollDown();
    }
};

/**
 * Remove message
 *
 * @param {Message} message
 */
Chat.prototype.removeMessage = function(message)
{
    this.sources.remove(message);
    this.messages.remove(message);
};

/**
 * Scroll down
 */
Chat.prototype.scrollDown = function()
{
    if (this.element) {
        this.element.scrollTop = this.element.scrollHeight;
    }
};

/**
 * Talk
 */
Chat.prototype.talk = function()
{
    var chat = this;

    if (this.message.content.length) {
        this.client.addEvent(
            'room:talk',
            this.message.content.substr(0, Message.prototype.maxLength),
            function (result) {
                if (result.success) {
                    chat.message.clear();
                } else {
                    console.error('Could not send %s', chat.message);
                }
            }
        );
    }
};

/**
 * On talk
 *
 * @param {Event} e
 */
Chat.prototype.onTalk = function(e)
{
    if (typeof(e.detail) !== 'undefined' && e.detail) {
        this.addMessage(new MessagePlayer(
            e.detail.client,
            e.detail.content,
            this.getPlayer(e.detail),
            e.detail.creation
        ));
    }
};

/**
 * Get player from message data
 *
 * @param {Object} data
 *
 * @return {Player}
 */
Chat.prototype.getPlayer = function(data)
{
    var player = this.room.getPlayerByClient(data.client);

    if (player) {
        return player;
    }

    return {
        name: typeof(data.name) === 'string' ? data.name : Message.prototype.name + ' ' + data.client,
        color: typeof(data.color) === 'string' ? data.color : Message.prototype.color
    };
};

/**
 * On new vote
 *
 * @param {Event} e
 */
Chat.prototype.onVoteNew = function(e)
{
    this.addMessage(new MessageVoteKick(e.detail.target));
};

/**
 * On kick
 *
 * @param {Event} e
 */
Chat.prototype.onKick = function(e)
{
    this.addMessage(new MessageKick(e.detail));
};

/**
 * On room master
 *
 * @param {Event} e
 */
Chat.prototype.onRoomMaster = function(e)
{
    if (e.detail.master) {
        this.addMessage(new MessageRoomMaster(e.detail.master));
    }
};

/**
 * On activity
 *
 * @param {Event} e
 */
Chat.prototype.onActivity = function(e)
{
    if (this.element) {
        this.auto = this.element.scrollTop === this.element.scrollHeight - this.element.clientHeight;
    }
};

/**
 * Add tutorial message
 */
Chat.prototype.addTip = function()
{
    this.addMessage(new MessageTip());
};

/**
 * Is message valid
 *
 * @param {Message} message
 *
 * @return {Boolean}
 */
Chat.prototype.isValid = function(message)
{
    if (!(message instanceof MessagePlayer)) {
        return true;
    }

    return this.isAllowed(message.client);
};

/**
 * Clear messages
 */
Chat.prototype.clearMessages = function()
{
    BaseChat.prototype.clearMessages.call(this);
    this.sources.clear();
    this.addTip();
};

/**
 * Mute/Unmute a client
 *
 * @param {Number} clientId
 */
Chat.prototype.toggleMute = function(clientId)
{
    var index  = this.muted.indexOf(clientId),
        exists = index >= 0;

    if (exists) {
        this.muted.splice(index, 1);
    } else {
        this.muted.push(clientId);
    }

    this.filterMessages();

    return !exists;
};

/**
 * Is this client allowed to talk?
 *
 * @param {Number} clientId
 *
 * @return {Boolean}
 */
Chat.prototype.isAllowed = function(clientId)
{
    return this.muted.indexOf(clientId) < 0;
};

/**
 * Filter messages
 */
Chat.prototype.filterMessages = function()
{
    var length = this.sources.count();

    this.messages.clear();

    for (var message, i = 0; i < length; i++) {
        message = this.sources.items[i];
        if (!(message instanceof MessagePlayer) || this.isAllowed(message.client)) {
            this.messages.add(message);
        }
    }
};

/**
 * Clear
 */
Chat.prototype.clear = function()
{
    this.clearMessages();

    if (this.element) {
        this.element.removeEventListener('scroll', this.onActivity);
    }

    this.message.clear();
    this.muted.length = 0;
    this.room         = null;
    this.element      = null;
};
