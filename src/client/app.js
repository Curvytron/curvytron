var curvytronApp = angular.module('curvytronApp', ['ngRoute']);

console.log("curvytronApp created");

curvytronApp.service('SocketClient', SocketClient);
curvytronApp.service('LobbyRepository', ['SocketClient', LobbyRepository]);
//curvytronApp.service('LobbyController', ['LobbyRepository', LobbyController]);
//curvytronApp.controller('LobbyController', ['$scope', 'LobbyRepository', LobbyController]);

curvytronApp.controller('LobbyController', ['$scope', 'LobbyRepository', function ($scope, LobbyRepository)
{
    $scope.rooms = LobbyRepository.getAll();

    LobbyRepository.on('lobby:new', function(e)
    {
        console.log("loadRooms", e);
        $scope.rooms = LobbyRepository.getAll();
    });

    /*if ($routeParams.roomId) {
        $scope.room = this.repository.get($routeParams.roomId);
    }*/
}]);

/*curvytronApp.controller('LobbyController', function($scope, LobbyRepository)
{
    $scope.rooms = $LobbyRepository.getAll();
    /*
    $http.get('js/fixtures/rooms.json').success(function(data)
    {
        $scope.rooms = data;

        if ($routeParams.roomId) {
            angular.forEach($scope.rooms, function(obj, id) {
                if (obj.id === $routeParams.roomId) {

                }
            });
        }
    });*/
/*});
*/

curvytronApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/lobbies', {
            templateUrl: 'js/partials/rooms/list.html',
            controller: 'LobbyController'
        })
        .when('/lobbies/:roomId', {
            templateUrl: 'js/partials/rooms/detail.html',
            controller: 'LobbyController'
        })
        .otherwise({
            redirectTo: '/lobbies'
        });
}]);

