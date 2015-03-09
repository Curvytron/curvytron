/**
 * Chat system
 */
function Chat()
{
    BaseChat.call(this);
}

Chat.prototype = Object.create(BaseChat.prototype);
Chat.prototype.constructor = Chat;
