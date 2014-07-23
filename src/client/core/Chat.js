/**
 * Chat system
 *
 * @param {SocketClient} client
 */
function Chat(client)
{
    this.client         = client;
    this.currentMessage = new Message();
    this.messages       = [];
    this.room           = null;
    this.$scope         = null;
    this.feed           = null;

    this.talk   = this.talk.bind(this);
    this.onTalk = this.onTalk.bind(this);

    this.attachEvents();
}

/**
 * Attach events
 */
Chat.prototype.attachEvents = function()
{
    this.client.on('room:talk', this.onTalk);
};

/**
 * Detach events
 */
Chat.prototype.detachEvents = function()
{
    this.client.off('room:talk', this.onTalk);
};

/**
 * Set player
 *
 * @param {Player} player
 */
Chat.prototype.setPlayer = function(player)
{
    if (this.room && !this.currentMessage.player && player) {
        this.currentMessage.player = player;
    }
};

/**
 * Set room
 *
 * @param {Room} room
 */
Chat.prototype.setRoom = function(room)
{
    if (!this.room || !this.room.equal(room)) {
        this.room = room;
        this.messages.length = 0;
    }
};

/**
 * Set scope
 */
Chat.prototype.setScope = function($scope)
{
    this.$scope = $scope;
    this.feed   = document.getElementById('feed');

    this.$scope.messages         = this.messages;
    this.$scope.submitTalk       = this.talk;
    this.$scope.currentMessage   = this.currentMessage;
    this.$scope.messageMaxLength = Message.prototype.maxLength;
};

/**
 * Refresh
 */
Chat.prototype.refresh = function()
{
    try {
        this.$scope.$apply();
    } catch (e) {

    }

    this.feed.scrollTop = this.feed.scrollHeight;
};

/**
 * Talk
 */
Chat.prototype.talk = function()
{
    var chat = this;

    if (this.currentMessage.content.length) {
        this.client.addEvent(
            'room:talk',
            this.currentMessage.serialize(),
            function (result) {
                if (result.success) {
                    chat.currentMessage.clear();
                    chat.refresh();
                } else {
                    console.error('Could not send %s', chat.currentMessage);
                }
            }
        );
    }
};

/**
 * On talk
 */
Chat.prototype.onTalk = function(e)
{
    var data = e.detail,
        player = this.room.players.getById(data.player);

    this.messages.push(new Message(player, data.content));
    this.refresh();
};

/**
 * Clear
 */
Chat.prototype.clear = function()
{
    this.currentMessage  = new Message();
    this.room            = null;
    this.$scope          = null;
    this.messages.length = 0;
};