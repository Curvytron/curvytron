function LobbiesController($scope, LobbyRepository)
{
    this.$scope     = $scope;
    this.repository = LobbyRepository;

    this.loadLobbies = this.loadLobbies.bind(this);

    this.repository.on('lobby:new', this.loadLobbies);

    this.loadLobbies();
}

/**
 * Lobbies action
 *
 * @return {Array}
 */
LobbiesController.prototype.loadLobbies = function(e)
{
    this.$scope.lobbies = this.repository.all();

    if (typeof(e) !== 'undefined') {
        this.$scope.$apply();
    }
};