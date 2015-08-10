/**
 * Room Controller
 *
 * @param {Object} $scope
 * @param {RoomRepository} RoomRepository
 */
function RoomConfigController($scope, repository)
{
    AbstractController.call(this, $scope);

    this.repository = repository;
    this.config     = null;

    // Binding:
    this.onJoined     = this.onJoined.bind(this);
    this.toggleBonus  = this.toggleBonus.bind(this);
    this.togglePreset = this.togglePreset.bind(this);
    this.setOpen      = this.setOpen.bind(this);
    this.setMaxScore  = this.setMaxScore.bind(this);
    this.setVariable  = this.setVariable.bind(this);

    // Hydrating scope
    this.$scope.toggleBonus  = this.toggleBonus;
    this.$scope.togglePreset = this.togglePreset;
    this.$scope.setOpen      = this.setOpen;
    this.$scope.setMaxScore  = this.setMaxScore;
    this.$scope.setVariable  = this.setVariable;

    this.repository.on('config:open', this.digestScope);
    this.repository.on('config:max-score', this.digestScope);
    this.repository.on('config:variable', this.digestScope);
    this.repository.on('config:bonus', this.digestScope);

    this.$scope.$parent.$watch('room', this.onJoined);
}

RoomConfigController.prototype = Object.create(AbstractController.prototype);
RoomConfigController.prototype.constructor = RoomConfigController;

/**
 * On room joined
 */
RoomConfigController.prototype.onJoined = function()
{
    if (this.$scope.$parent.room) {
        this.config = this.$scope.$parent.room.config;
        this.$scope.config = this.config;
    }
};

/**
 * Toggle bonus
 *
 * @param {String} bonus
 */
RoomConfigController.prototype.toggleBonus = function(bonus)
{
    if (this.config.bonusExists(bonus) && this.repository.amIMaster()) {
        var config = this.config;

        this.repository.setConfigBonus(bonus, function (result) {
            config.setBonus(bonus, result.enabled);
        });
    } else {
        console.error('Unknown bonus: %s', bonus.type);
    }
};

/**
 * Toggle preset
 *
 * @param {String} bonus
 */
RoomConfigController.prototype.togglePreset = function(preset)
{
    if (this.config.preset === preset) {
        if (preset === this.config.getDefaultPreset()) {
            return;
        }

        return this.applyPreset(this.config.getDefaultPreset());
    }

    this.applyPreset(preset);
};

/**
 * Apply the given preset
 *
 * @param {Preset} preset
 */
RoomConfigController.prototype.applyPreset = function(preset)
{
    if (this.repository.amIMaster()) {
        for (var bonus in this.config.bonuses) {
            if (this.config.bonuses[bonus] !== preset.hasBonus(bonus)) {
                this.toggleBonus(bonus);
            }
        }

        this.config.preset = preset;
    }
};

/**
 * Set open
 */
RoomConfigController.prototype.setOpen = function(open)
{
    if (this.repository.amIMaster()) {
        var config = this.config;

        this.repository.setConfigOpen(open, function (result) {
            config.setOpen(result.open);
            config.setPassword(result.password);
        });
    }
};

/**
 * Set max score
 */
RoomConfigController.prototype.setMaxScore = function(maxScore)
{
    if (this.repository.amIMaster()) {
        var config = this.config;

        this.repository.setConfigMaxScore(maxScore, function (result) {
            config.setMaxScore(result.maxScore);
        });
    }
};

/**
 * Set variable
 */
RoomConfigController.prototype.setVariable = function(variable)
{
    if (this.config.variableExists(variable) && this.repository.amIMaster()) {
        var config = this.config;

        this.repository.setConfigVariable(variable, this.config.getVariable(variable), function (result) {
            config.setVariable(result.variable, result.value);
        });
    }
};
