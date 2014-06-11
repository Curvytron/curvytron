var curvytronApp = angular.module('curvytronApp', ['ngRoute', 'curvytronControllers']),
    curvytronControllers = angular.module('curvytronControllers', []);

curvytronApp.service('SocketClient', SocketClient);
curvytronApp.service('RoomRepository', ['SocketClient', RoomRepository]);

curvytronApp.controller('RoomsController', ['$scope', 'RoomRepository', RoomsController]);
curvytronApp.controller('RoomController', ['$scope', '$routeParams', 'RoomRepository', RoomController]);
curvytronApp.controller('GameController', ['$scope', '$routeParams', 'RoomRepository', GameController]);

curvytronApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'js/views/rooms/list.html',
            controller: 'RoomsController'
        })
        .when('/room/:name', {
            templateUrl: 'js/views/rooms/detail.html',
            controller: 'RoomController'
        })
        .when('/game/:name', {
            templateUrl: 'js/views/game/play.html',
            controller: 'GameController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

