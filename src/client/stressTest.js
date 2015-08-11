(function(){
    'use strict';

    var nbPlayers = 50;

    function getCurrentController() {
        return angular.element(document.getElementsByTagName('section')[0]).scope();
    }

    function createRoom() {
        var roomsController = getCurrentController();

        // Ensure it's the rooms controller
        if (!roomsController.rooms) {
            return;
        }

        roomsController.createRoom();
    }

    function createPlayers() {
        var roomController = getCurrentController(),
            total = roomController.room.players.items.length;

        // Ensure it's the room controller
        if (!roomController.room) {
            return;
        }

        roomController.submitAddPlayer('Slug #' + total);

        if (total < nbPlayers) {
            setTimeout(createPlayers, 50);
        } else {
            launch();
        }
    }

    function launch() {
        var roomController = getCurrentController();

        // Ensure it's the room controller
        if (!roomController.room) {
            return;
        }

        // Set all players ready
        roomController.launch();
    }

    // Create a room
    createRoom();
    setTimeout(createPlayers, 500);
}());
