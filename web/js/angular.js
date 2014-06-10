/*!
 * curvytron 0.0.1
 * https://github.com/Gameo/curvytron
 * MIT
 */

var curvytronApp = angular.module('curvytronApp', ['ngRoute']);

curvytronApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'js/partials/rooms/list.html', controller: 'RoomCtrl'});
    $routeProvider.when('/room/:roomId', {templateUrl: 'js/partials/rooms/detail.html', controller: 'RoomCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
}]);

curvytronApp.controller('RoomCtrl', function($scope, $http, $routeParams, $filter) {
    $http.get('js/fixtures/rooms.json').success(function(data) {
        $scope.rooms = data;
        if ($routeParams.roomId) {
            angular.forEach($scope.rooms, function(obj, id) {
                if (obj.id === $routeParams.roomId) {
                    $scope.room = obj;
                }
            });
        }
    });

});
