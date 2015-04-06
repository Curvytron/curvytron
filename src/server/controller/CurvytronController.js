/**
 * Curvytron Controller
 *
 * @param {Collection} clients
 */
function CurvytronController(clients) {
    // create socket for all clients
    this.clientGroup = new SocketGroup(clients);
}

CurvytronController.prototype.sendNbPlayers = function() {
    this.clientGroup.addEvent('connect:nbPlayers', this.clientGroup.count());
};
