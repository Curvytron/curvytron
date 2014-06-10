
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
