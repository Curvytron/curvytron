var curvytronApp = angular.module('curvytronApp', ['ngRoute', 'curvytronControllers']),
    curvytronControllers = angular.module('curvytronControllers', []);

curvytronApp.service('SocketClient', SocketClient);
curvytronApp.service('RoomRepository', ['SocketClient', RoomRepository]);
//curvytronApp.service('RoomController', ['RoomRepository', RoomController]);
curvytronApp.controller('RoomsController', ['$scope', 'RoomRepository', RoomsController]);
curvytronApp.controller('RoomController', ['$scope', '$routeParams', 'RoomRepository', RoomController]);

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
        .otherwise({
            redirectTo: '/'
        });
}]);

