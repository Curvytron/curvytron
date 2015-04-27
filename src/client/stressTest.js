(function(){
    'use strict';

    var nbPlayers = 20;

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

    function createReadyPlayers(nb) {
        var roomController = getCurrentController(),
            i;

        // Ensure it's the room controller
        if (!roomController.room) {
            return;
        }

        for(i = 1; i <= nb; i++) {
            roomController.submitAddPlayer('Slug #' + i);
        }
    }

    function setPlayersReady() {
        var roomController = getCurrentController(),
            players,
            i;

        // Ensure it's the room controller
        if (!roomController.room) {
            return;
        }

        // Set all players ready
        players = roomController.room.players.items;
        for (i in players) {
            if (!players.hasOwnProperty(i)) {
                continue;
            }

            roomController.setReady(players[i]);
        }
    }

    // Create a room
    createRoom();

    // Create n players
    setTimeout(function() {
        createReadyPlayers(nbPlayers);

        setTimeout(function() {
            // Set all players ready
            setPlayersReady();
        }, 1000);
    }, 1000);
}());
