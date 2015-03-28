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

    this.onChatLoaded = this.onChatLoaded.bind(this);
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
    this.chat.setElement(document.getElementById('chat-feed'));
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
