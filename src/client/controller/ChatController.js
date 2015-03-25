/**
 * Chat Controller
 *
 * @param {Object} $scope
 */
function ChatController($scope, chat)
{
    this.$scope = $scope;
    this.chat   = chat;

    this.onChatLoaded = this.onChatLoaded.bind(this);
    this.onVote       = this.onVote.bind(this);
    this.onMessage    = this.onMessage.bind(this);

    this.$scope.chatLoaded       = this.onChatLoaded;
    this.$scope.messages         = this.chat.messages;
    this.$scope.currentMessage   = this.chat.message;
    this.$scope.submitTalk       = this.chat.talk;
    this.$scope.messageMaxLength = Message.prototype.maxLength;

    this.chat.on('message', this.onMessage);
}

/**
 * On chat loaded
 */
ChatController.prototype.onChatLoaded = function ()
{
    this.chat.setElement(document.getElementById('feed'));
};

/**
 * On vote
 *
 * @param {Event} e
 */
ChatController.prototype.onVote = function(e)
{
    var player = e.detail.target;

    if (e.type === 'vote:new') {
        this.chat.messages.push(new VoteKickMessage(this.chat.curvybot, player));
    } else if (e.type === 'vote:close' && e.detail.result) {
        this.chat.messages.push(new KickMessage(this.chat.curvybot, player));
    }

    this.applyScope();
};

/**
 * On message
 *
 * @param {Event} event
 */
ChatController.prototype.onMessage = function(event)
{
    this.applyScope();
};

/**
 * Apply scope
 */
ChatController.prototype.applyScope = CurvytronController.prototype.applyScope;
