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
    var player = message.player ? message.player : null,
        client = message.client ? message.client : null;

    this.inspector.client.writePoint(
        Inspector.prototype.CHAT_MESSAGE,
        {
            id: this.uniqId,
            ip: client ? client.ip : null,
            client: client ? client.id : null,
            player: player ? player.name : null,
            message: message.content
        }
    );
};
