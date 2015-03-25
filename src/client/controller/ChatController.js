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
 * Tips
 *
 * @type {Array}
 */
ChatController.prototype.tips = [
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
 * Add tutorial message
 */
ChatController.prototype.addTip = function()
{
    this.chat.messages.push(new Message(
        this.tips[Math.floor(Math.random() * this.tips.length)],
        null,
        this.chat.curvybot
    ));
};

/**
 * Apply scope
 */
ChatController.prototype.applyScope = CurvytronController.prototype.applyScope;
