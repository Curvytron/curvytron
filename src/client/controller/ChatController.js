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

    this.onLoaded  = this.onLoaded.bind(this);
    this.onMessage = this.onMessage.bind(this);

    this.$scope.chatLoaded       = this.onLoaded;
    this.$scope.messages         = this.chat.messages;
    this.$scope.currentMessage   = this.chat.message;
    this.$scope.submitTalk       = this.chat.talk;
    this.$scope.messageMaxLength = Message.prototype.maxLength;

    this.chat.on('message', this.onMessage);
}

/**
 * On chat DOM element loaded
 */
ChatController.prototype.onLoaded = function ()
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
