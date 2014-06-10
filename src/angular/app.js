var curvytronApp = angular.module('curvytronApp', ['ngRoute']);

curvytronApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'js/partials/rooms/list.html',
            controller: 'RoomCtrl'
        })
        .when('/room/:roomId', {
            templateUrl: 'js/partials/rooms/detail.html',
            controller: 'RoomCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
