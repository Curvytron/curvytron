var curvytronApp = angular.module('curvytronApp', []);

curvytronApp.controller('RoomCtrl', function($scope, $http) {
    $http.get('js/fixtures/rooms.json').success(function(data) {
        $scope.rooms = data;
    });
});
