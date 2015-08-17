/**
 * Chat Controller
 *
 * @param {Object} $scope
 * @param {Chat} chat
 */
function ChatController($scope, chat)
{
    AbstractController.call(this, $scope);

    this.chat   = chat;

    this.onLoaded = this.onLoaded.bind(this);
    this.mute     = this.mute.bind(this);

    this.$scope.onLoaded       = this.onLoaded;
    this.$scope.mute           = this.mute;
    this.$scope.messages       = this.chat.messages.items;
    this.$scope.currentMessage = this.chat.message;
    this.$scope.submitTalk     = this.chat.talk;

    this.chat.on('message', this.digestScope);
    this.chat.on('filtered', this.digestScope);
}

ChatController.prototype = Object.create(AbstractController.prototype);
ChatController.prototype.constructor = ChatController;

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
