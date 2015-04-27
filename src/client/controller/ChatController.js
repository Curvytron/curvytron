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
    this.applyScope  = this.applyScope.bind(this);
    this.digestScope = this.digestScope.bind(this);

    this.$scope.onLoaded       = this.onLoaded;
    this.$scope.messages       = this.chat.messages;
    this.$scope.currentMessage = this.chat.message;
    this.$scope.submitTalk     = this.chat.talk;

    this.chat.on('message', this.digestScope);
}

/**
 * On chat DOM element loaded
 */
ChatController.prototype.onLoaded = function ()
{
    this.chat.setElement(document.getElementById('chat-feed'));
};

/**
 * Apply scope
 */
ChatController.prototype.applyScope = CurvytronController.prototype.applyScope;

/**
 * Digest scope
 */
ChatController.prototype.digestScope = CurvytronController.prototype.digestScope;
