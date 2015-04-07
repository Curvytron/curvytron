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
    this.element    = null;
    this.auto       = true;

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
 * Tips
 *
 * @type {Array}
 */
Chat.prototype.tips = [
    'To customize your left/right controls, click the [←]/[→] buttons and press any key.',
    'Curvytron supports gamepads! Connect it, press A, then setup your controls.',
    'Yes, you can play Curvytron on your smartphone ;)',
    'You can add multiple players on the same computer.',
    'Green bonuses apply only to you.',
    'Red bonuses target your ennemies.',
    'White bonuses affect everyone.',
    'Making a Snail™ is a sure way to win, but other players might hate you for it.',
    'The Enrichment Center regrets to inform you that this next test is impossible. Make no attempt to solve it.'
];

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
    if (BaseChat.prototype.addMessage.call(this, message) && this.auto) {
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
    if (typeof(e.detail) !== 'undefined' && e.detail) {
        var data    = e.detail,
            player  = this.room.getPlayerByClient(data.client),
            message = new Message(data.content, data.client, player ? player : {name: data.name, color: data.color}, data.creation);

        this.addMessage(message);
    }
};

/**
 * On new vote
 *
 * @param {Event} e
 */
Chat.prototype.onVoteNew = function(e)
{
    this.addMessage(new VoteKickMessage(this.curvybot, e.detail.target));
};

/**
 * On kick
 *
 * @param {Event} e
 */
Chat.prototype.onKick = function(e)
{
    this.addMessage(new KickMessage(this.curvybot, e.detail));
};

/**
 * On room master
 *
 * @param {Event} e
 */
Chat.prototype.onRoomMaster = function(e)
{
    if (e.detail.master) {
        this.addMessage(new RoomMasterMessage(this.curvybot, e.detail.master));
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
    this.addMessage(new Message(
        this.tips[Math.floor(Math.random() * this.tips.length)],
        null,
        this.curvybot
    ));
};

/**
 * Clear messages
 */
Chat.prototype.clearMessages = function()
{
    BaseChat.prototype.clearMessages.call(this);
    this.addTip();
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
