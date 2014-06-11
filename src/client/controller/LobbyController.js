function LobbyController($scope, $routeParams, LobbyRepository)
{
    this.$scope     = $scope;
    this.repository = LobbyRepository;

    this.loadLobby($routeParams.name);
}

/**
 * Lobbies action
 *
 * @return {Array}
 */
LobbyController.prototype.loadLobby = function(name)
{
    this.$scope.lobby = this.repository.get(name);
};