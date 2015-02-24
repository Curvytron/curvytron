var curvytronApp = angular.module('curvytronApp', ['ngRoute', 'ngCookies', 'colorpicker.module']),
    gamepadListener = new GamepadListener({analog: false, deadZone: 0.4});

gamepadListener.start();

curvytronApp.service('SocketClient', SocketClient);
curvytronApp.service('ActivityWatcher', ['SocketClient', ActivityWatcher]);
curvytronApp.service('RoomRepository', ['SocketClient', RoomRepository]);
curvytronApp.service('Chat', ['SocketClient', Chat]);
curvytronApp.service('Profile', ['$rootScope', Profile]);
curvytronApp.service('Radio', ['Profile', Radio]);
curvytronApp.service('SoundManager', ['Profile', SoundManager]);
curvytronApp.service('Notifier', ['SoundManager', 'ActivityWatcher', Notifier]);
curvytronApp.service('Analyser', ['$rootScope', Analyser]);

curvytronApp.controller(
    'CurvytronController',
    ['$scope', 'Profile', 'Analyser', 'ActivityWatcher', CurvytronController]
);

curvytronApp.controller(
    'RoomsController',
    ['$scope', '$location', 'SocketClient', RoomsController]
);
curvytronApp.controller(
    'RoomController',
    ['$scope', '$routeParams', '$location', 'SocketClient', 'RoomRepository', 'Profile', 'Chat', 'Notifier', RoomController]
);
curvytronApp.controller(
    'RoomConfigController',
    ['$scope', 'RoomRepository', RoomConfigController]
);
curvytronApp.controller(
    'GameController',
    ['$scope', '$routeParams', '$location', 'SocketClient', 'RoomRepository', 'Chat', 'Radio', 'Notifier', 'SoundManager', GameController]
);

curvytronApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'js/views/rooms/list.html',
            controller: 'RoomsController'
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
