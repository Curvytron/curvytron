var curvytronApp = angular.module('curvytronApp', ['ngRoute', 'curvytronControllers']),
    curvytronControllers = angular.module('curvytronControllers', []);

curvytronApp.service('SocketClient', SocketClient);
curvytronApp.service('LobbyRepository', ['SocketClient', LobbyRepository]);
//curvytronApp.service('LobbyController', ['LobbyRepository', LobbyController]);
curvytronApp.controller('LobbiesController', ['$scope', 'LobbyRepository', LobbiesController]);
curvytronApp.controller('LobbyController', ['$scope', '$routeParams', 'LobbyRepository', LobbyController]);

curvytronApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'js/partials/rooms/list.html',
            controller: 'LobbiesController'
        })
        .when('/lobby/:name', {
            templateUrl: 'js/partials/rooms/detail.html',
            controller: 'LobbyController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

