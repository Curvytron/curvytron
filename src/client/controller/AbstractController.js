/**
 * Abstract Controller
 *
 * @param {Object} $scope
 */
function AbstractController($scope)
{
    EventEmitter.call(this);

    this.$scope        = $scope;
    this.digestTimeout = null;

    this.applyScope         = this.applyScope.bind(this);
    this.digestScope        = this.digestScope.bind(this);
    this.requestDigestScope = this.requestDigestScope.bind(this);
}

AbstractController.prototype = Object.create(EventEmitter.prototype);
AbstractController.prototype.constructor = AbstractController;

/**
 * Digest timeout
 *
 * @type {Number}
 */
AbstractController.prototype.digestTimeoutValue = 1000/25;

/**
 * Apply scope
 */
AbstractController.prototype.applyScope = function()
{
    var phase = this.$scope && this.$scope.$root ? this.$scope.$root.$$phase : null;

    if (phase !== '$apply' && phase !== '$digest') {
        this.$scope.$apply();
    }
};

/**
 * Digest scope
 */
AbstractController.prototype.digestScope = function()
{
    this.clearDigestTiemout();

    var phase = this.$scope && this.$scope.$root ? this.$scope.$root.$$phase : null;

    if (phase !== '$apply' && phase !== '$digest') {
        this.$scope.$digest();
    }
};

/**
 * Request a digest scope
 */
AbstractController.prototype.requestDigestScope = function() {
    if (!this.digestTimeout) {
        this.digestTimeout = setTimeout(this.digestScope, this.digestTimeoutValue);
    }
};

/**
 * Clear digest timeout
 *
 * @return {boolean}
 */
AbstractController.prototype.clearDigestTiemout = function() {
    if (this.digestTimeout) {
        this.digestTimeout = clearTimeout(this.digestTimeout);
    }
};
