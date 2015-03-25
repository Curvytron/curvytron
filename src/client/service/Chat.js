/**
 * Chat system
 *
 * @param {SocketClient} client
 * @param {RoomRepository} repository
 */
function Chat(client, repository)
{
    BaseChat.call(this);

    this.client     = client;
    this.repository = repository;
    this.message    = new Message(null, this.client);
    this.room       = null;
    this.$scope     = null;
    this.element    = null;
    this.auto       = true;

    this.talk       = this.talk.bind(this);
    this.onTalk     = this.onTalk.bind(this);
    this.scrollDown = this.scrollDown.bind(this);
    this.onActivity = this.onActivity.bind(this);
    this.setRoom    = this.setRoom.bind(this);

    this.attachEvents();
}

Chat.prototype = Object.create(BaseChat.prototype);
Chat.prototype.constructor = Chat;

/**
 * Curvybot profile
 *
 * @type {Object}
 */
Chat.prototype.curvybot = {
    name: 'Curvybot',
    color: '#ff8069',
    icon: 'icon-megaphone'
};

/**
 * Attach events
 */
Chat.prototype.attachEvents = function()
{
    this.client.on('room:talk', this.onTalk);
    this.repository.on('room:join', this.setRoom);
    this.repository.on('room:leave', this.setRoom);
    this.repository.on('vote:new', this.onVote);
    this.repository.on('vote:close', this.onVote);
};

/**
 * Detach events
 */
Chat.prototype.detachEvents = function()
{
    this.client.off('room:talk', this.onTalk);
    this.repository.off('room:join', this.setRoom);
    this.repository.off('room:leave', this.setRoom);
    this.repository.off('vote:new', this.onVote);
    this.repository.off('vote:close', this.onVote);
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
 * Refresh
 */
Chat.prototype.refresh = function()
{
    if (this.auto) {
        this.scrollDown();
    }
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
            this.message.serialize(),
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
    var data    = e.detail,
        player  = this.room.getPlayerByClient(data.client),
        message = new Message(data.content, data.client, player ? player : {name: data.name, color: data.color}, data.creation);

    this.addMessage(message);
    this.refresh();
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
 * Clear
 */
Chat.prototype.clear = function()
{
    this.clearMessages();

    if (this.element) {
        this.element.removeEventListener('scroll', this.onActivity);
    }

    this.message = new Message(null, this.client);
    this.room    = null;
    this.element = null;
};
