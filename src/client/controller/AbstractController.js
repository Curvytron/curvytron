/**
 * Abstract Controller
 *
 * @param {Object} $scope
 */
function AbstractController($scope)
{
    this.$scope = $scope;
}

/**
 * Digest timeout
 *
 * @type {Number}
 */
AbstractController.prototype.digestTimeoutValue = 100;

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
    this.digestTimeout = null;
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
