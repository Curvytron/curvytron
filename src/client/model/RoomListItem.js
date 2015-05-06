/**
 * Room list item
 *
 * @param {String} name
 * @param {Number} players
 * @param {Boolean} game
 * @param {Boolean} open
 */
function RoomListItem(name, players, game, open)
{
    this.name     = name;
    this.players  = players;
    this.game     = game;
    this.open     = open;
    this.password = '';
}

/**
 * Get url
 *
 * @return {String}
 */
RoomListItem.prototype.getUrl = function()
{
    return '/room/' + encodeURIComponent(this.name);
};
