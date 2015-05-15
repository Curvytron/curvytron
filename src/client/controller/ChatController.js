/**
 * Chat Controller
 *
 * @param {Object} $scope
 * @param {Chat} chat
 */
function ChatController($scope, chat)
{
    this.$scope = $scope;
    this.chat   = chat;

    this.onLoaded    = this.onLoaded.bind(this);
    this.mute        = this.mute.bind(this);
    this.applyScope  = this.applyScope.bind(this);
    this.digestScope = this.digestScope.bind(this);

    this.$scope.onLoaded       = this.onLoaded;
    this.$scope.mute           = this.mute;
    this.$scope.messages       = this.chat.messages;
    this.$scope.currentMessage = this.chat.message;
    this.$scope.submitTalk     = this.chat.talk;

    this.chat.on('message', this.digestScope);
    this.chat.on('filtered', this.digestScope);
}

/**
 * On chat DOM element loaded
 */
ChatController.prototype.onLoaded = function ()
{
    this.chat.setElement(document.getElementById('chat-feed'));
};

/**
 * Mute client from the given message
 *
 * @param {MessagePlayer} message
 */
ChatController.prototype.mute = function (message)
{
    if (this.chat.toggleMute(message.client)) {
        this.chat.addMessage(new MessageMute(message.client, message.player));
    } else {
        this.chat.removeMessage(message);
    }

    this.digestScope();
};

/**
 * Apply scope
 */
ChatController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
ChatController.prototype.digestScope = CurvytronController.prototype.digestScope;
