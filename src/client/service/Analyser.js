/**
 * Analyser
 *
 * @param {Object} $rootScope
 * @param {Object} $document
 * @param {RoomsRepository} roomsRepository
 * @param {RoomRepository} roomRepository
 */
function Analyser($rootScope, $document, roomsRepository, roomRepository)
{
    if (typeof(ga) === 'undefined') {
        return false;
    }

    this.$rootScope      = $rootScope;
    this.$document       = $document[0];
    this.roomsRepository = roomsRepository;
    this.roomRepository  = roomRepository;

    this.onRouteChange = this.onRouteChange.bind(this);
    this.onRoomCreated = this.onRoomCreated.bind(this);

    this.$rootScope.$on('$routeChangeSuccess', this.onRouteChange);
    this.$rootScope.$on('$routeUpdate', this.onRouteChange);
    this.roomsRepository.on('action:room:created', this.onRoomCreated);
}

/**
 * On route changed
 *
 * @param {Event} event
 * @param {Object} currentScope
 * @param {Object} previousScope
 */
Analyser.prototype.onRouteChange = function(event, currentScope, previousScope)
{
    var path = this.getPath(currentScope.originalPath, currentScope.pathParams),
        title = this.getTitle(currentScope.$$route.controller, currentScope.params);

    this.sendPageView(path, title);
};

/**
 * On room created
 *
 * @param {Event} e
 */
Analyser.prototype.onRoomCreated = function(e)
{
    var name = e.detail.name,
        room = e.detail.room;

    this.sendClickEvent({
        action: 'Create Room',
        withName: name ? true : false,
        name: room.name
    });
};

/**
 * Get path
 *
 * @param {String} path
 * @param {Object} params
 *
 * @return {String}
 */
Analyser.prototype.getPath = function(path, params)
{
    for (var key in params) {
        if (Object.hasOwnProperty(key)) {
            path = path.replace(':' + key, params[key]);
        }
    }

    return path;
};

/**
 * Get title
 *
 * @param {String} controller
 * @param {Object} params
 *
 * @return {String}
 */
Analyser.prototype.getTitle = function(controller, params)
{
    if (controller === 'RoomsController') {
        return 'Home';
    }

    if (controller === 'RoomController') {
        return 'Room: ' + (typeof(params.name) !== 'undefined' ? params.name : null);
    }

    if (controller === 'GameController') {
        return 'Game: ' + (typeof(params.name) !== 'undefined' ? params.name : null);
    }

    return this.$document.title;
};

/**
 * Send page view
 *
 * @param {Object} data
 */
Analyser.prototype.sendPageView = function(page, title)
{
    ga('send', 'pageview', title ? { page: page, title: title } : page);
};

/**
 * Send default click event
 *
 * @param {String} label
 * @param {Number} value
 */
Analyser.prototype.sendClickEvent = function(label, value)
{
    this.sendEvent('button', 'click', label, value);
};

/**
 * Send event
 *
 * @param {String} category
 * @param {String} action
 * @param {String} label
 * @param {Number} value
 */
Analyser.prototype.sendEvent = function(category, action, label, value)
{
    ga('send', 'event', category, action, label, value);
};
