/**
 * Chat tracker
 *
 * @param {Inspector} inspector
 * @param {String} id
 * @param {Chat} chat
 */
function ChatTracker (inspector, id, chat)
{
    Tracker.call(this, inspector, id);

    this.chat = chat;

    this.onMessage = this.onMessage.bind(this);

    this.chat.on('message', this.onMessage);
}

ChatTracker.prototype = Object.create(Tracker.prototype);
ChatTracker.prototype.constructor = ChatTracker;

/**
 * On message
 *
 * @param {Event} e
 */
ChatTracker.prototype.onMessage = function(message)
{
    this.emit('message', {message: message, tracker: this});
};

/**
 * @inheritDoc
 */
ClientTracker.prototype.serialize = function()
{
    var data = Tracker.prototype.serialize.call(this);

    data.value = thhis.chat.messages.length;

    return data;
};
