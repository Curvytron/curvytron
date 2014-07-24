/**
 * Inspector
 *
 * @param {Server} server
 */
function Inspector (server, logDir)
{
    this.server = server;
    this.path   = path.resolve(logDir);

    this.onGameNew   = this.onGameNew.bind(this);
    this.onGameRound = this.onGameRound.bind(this);
    this.onGameEnd   = this.onGameEnd.bind(this);

    this.server.roomController.on('game:new', this.onGameNew);
}

/**
 * On game add
 *
 * @param {Game} game
 */
Inspector.prototype.onGameNew = function(data)
{
    var game = data.game;

    game.on('round:new', this.onGameRound);
    game.on('end', this.onGameEnd);

    this.log(game, 'New game ' + game.name + '.');
};

/**
 * On game round
 *
 * @param {Game} game
 */
Inspector.prototype.onGameRound = function(data)
{
    var game = data.game;

    if (game.rounds === 0) {
        this.log(game, 'Game starts with ' + game.avatars.count() + ' players.');
    }
};

/**
 * On game end
 *
 * @param {Game} game
 */
Inspector.prototype.onGameEnd = function(data)
{
    var game = data.game;

    this.log(game, 'Game won in ' + game.rounds + ' rounds.');
};

/**
 * Log
 *
 * @param {Game} game
 */
Inspector.prototype.log = function(game, data)
{
    fs.appendFile(this.path + '/' + game.name + '.log', new Date() + ': ' + data + '\r\n', function (e) {});
};