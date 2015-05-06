/**
 * Analyser
 *
 * @param {Object} $rootScope
 */
function Analyser($rootScope)
{
    if (typeof(ga) === 'undefined') {
        return false;
    }

    this.$rootScope = $rootScope;

    this.onRouteChange = this.onRouteChange.bind(this);

    this.$rootScope.$on('$routeChangeSuccess', this.onRouteChange);
    this.$rootScope.$on('$routeUpdate', this.onRouteChange);
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
    var path  = this.getPath(currentScope.originalPath, currentScope.pathParams),
        title = this.getTitle(currentScope.$$route.controller, currentScope.params);

    this.sendPageView(path, title);
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
};

/**
 * Send page view
 *
 * @param {Object} data
 */
Analyser.prototype.sendPageView = function(page, title)
{
    ga('send', 'pageview', {page: page, title: title});
};
