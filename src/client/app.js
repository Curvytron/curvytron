var curvytronApp = angular.module('curvytronApp', ['ngRoute', 'ngCookies', 'colorpicker.module']),
    gamepadListener = new GamepadListener({analog: false, deadZone: 0.4});

curvytronApp.controller('CurvytronController', ['$scope', function($scope) {
    $scope.curvytron = {};
    $scope.curvytron.bodyClass = null;
}]);

curvytronApp.service('SocketClient', SocketClient);
curvytronApp.service('RoomRepository', ['SocketClient', RoomRepository]);
curvytronApp.service('Chat', ['SocketClient', Chat]);
curvytronApp.service('Profile', ['$cookies', Profile]);

curvytronApp.controller(
    'RoomsController',
    ['$scope', '$location', 'RoomRepository', 'SocketClient', RoomsController]
);
curvytronApp.controller(
    'RoomController',
    ['$scope', '$rootScope', '$routeParams', '$location', 'RoomRepository', 'SocketClient', 'Profile', 'Chat', RoomController]
);
curvytronApp.controller(
    'GameController',
    ['$scope', '$routeParams', '$location', 'RoomRepository', 'SocketClient', 'Chat', GameController]
);
curvytronApp.controller(
    'ProfileController',
    ['$scope', 'Profile', ProfileController]
);

curvytronApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'js/views/rooms/list.html',
            controller: 'RoomsController'
        })
        .when('/profile', {
            templateUrl: 'js/views/profile/profile.html',
            controller: 'ProfileController'
        })
        .when('/about', {
            templateUrl: 'js/views/pages/about.html'
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
