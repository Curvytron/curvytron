/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.world   = new World(this.size);
    this.inRound = false;
    this.deaths  = new Collection([], 'name');
    this.clients = this.room.clients;

    this.addPoint                   = this.addPoint.bind(this);
    this.onDie                      = this.onDie.bind(this);
    this.bonusPrinting              = false;
    this.bonusPrintingTimeout       = null;
    this.timeouts                   = [];

    this.toggleBonusPrinting = this.toggleBonusPrinting.bind(this);

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].clear();
        this.avatars.items[i].on('point', this.addPoint);
        this.avatars.items[i].on('die', this.onDie);
        this.avatars.items[i].setMask(i+1);
    }
};

Game.prototype = Object.create(BaseGame.prototype);

Game.prototype.bonusCap            = 20;
Game.prototype.bonusPoppingRate    = 0.2;
Game.prototype.noBonusPrintingTime = 200;
Game.prototype.bonusPrintingTime   = 3000;

/**
 * Trail latency
 *
 * @type {Number}
 */
Game.prototype.trailLatency = 150;

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    BaseGame.prototype.update.call(this, step);

    var avatar, bonus;

    if (this.bonusPrinting) {
        this.popBonus();
    }

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        if (avatar.alive && !this.world.testCircle(avatar.update(step))) {
            avatar.die();
        }

        // check if a bonus has been taken
        for (var j = this.bonuses.ids.length - 1; j >= 0; j--) {
            bonus = this.bonuses.items[j];

            if (bonus.isTakenBy(avatar)) {
                // sample speed bonus test
                bonus.clear();
                this.emit('bonus:clear', { game: this, bonus: bonus });
                avatar.upVelocity();
                this.timeouts.push(setTimeout(function() { avatar.downVelocity() }, 3333));
            }
        }
    }
};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    var result = BaseGame.prototype.removeAvatar.call(this, avatar);

    this.deaths.remove(avatar);
    this.checkRoundEnd();

    return result;
};

/**
 * Add point
 *
 * @param {Object} data
 */
Game.prototype.addPoint = function(data)
{
    var world = this.world,
        circle = [data.point[0], data.point[1], data.avatar.radius, data.avatar.mask];

    setTimeout(function () { circle[3] = 0; }, this.trailLatency);

    world.addCircle(circle);
};

/**
 * Is done
 *
 * @return {Boolean}
 */
Game.prototype.isWon = function()
{
    var game = this,
        winner = this.avatars.match(function () { return this.score >= game.maxScore; });

    return winner ? winner : false;
};

/**
 * On die
 *
 * @param {Object} data
 */
Game.prototype.onDie = function(data)
{
    this.deaths.add(data.avatar);

    this.checkRoundEnd();
};

/**
 * Check if the round should end
 */
Game.prototype.checkRoundEnd = function()
{
    if (!this.inRound) {
        return;
    }

    var alivePlayers = this.avatars.filter(function () { return this.alive; });

    if (alivePlayers.count() <= 1) {
        this.inRound = false;
        this.setScores();
        setTimeout(this.endRound, this.warmdownTime);
    }
};

/**
 * Is ready
 *
 * @return {Boolean}
 */
Game.prototype.isReady = function()
{
    return this.avatars.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Set scores
 */
Game.prototype.setScores = function()
{
    if (this.end) {
        var total = this.avatars.count();

        for (var i = this.deaths.items.length - 1; i >= 0; i--) {
            this.deaths.items[i].addScore(i + 1);
        }
        
        if (this.deaths.count() < total) {
            var winner = this.avatars.match(function () { return this.alive; });

            winner.addScore(total);
            this.emit('round:winner', {game: this, winner: winner});
        }

        this.deaths.clear();
    }
};

/**
 * Check end of round
 */
Game.prototype.endRound = function()
{
    BaseGame.prototype.endRound.call(this);

    this.stopBonusPrinting();
    this.resetBonusEffects();
    this.clearTimeouts();

    this.emit('round:end', {game: this});

    if (this.isWon()) {
        this.end();
    } else {
        this.newRound();
    }
};

/**
 * New round
 */
Game.prototype.newRound = function()
{
    if (!this.inRound) {
        var avatar, bonus, i;

        this.emit('round:new', {game: this});

        this.world.clear();

        this.inRound = true;
        this.deaths.clear();

        for (i = this.avatars.items.length - 1; i >= 0; i--) {
            avatar = this.avatars.items[i];

            avatar.clear();
            avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
            avatar.setAngle(Math.random() * Math.PI * 2);
        }

        // clear the bonuses stack
        for (i = this.bonuses.ids.length - 1; i >= 0; i--) {
            bonus = this.bonuses.items[i];
            bonus.clear();
            this.emit('bonus:clear', { game: this, bonus: bonus});
            this.bonuses.removeById(bonus.id);
        }

        BaseGame.prototype.newRound.call(this);
    }
};

/**
 * Start
 */
Game.prototype.start = function()
{
    if (!this.frame) {
        for (var i = this.avatars.items.length - 1; i >= 0; i--) {
            setTimeout(this.avatars.items[i].togglePrinting, 3000);
        }
    }

    // toggle bonuses printing
    this.timeouts.push(setTimeout(this.toggleBonusPrinting, 3000));

    BaseGame.prototype.start.call(this);
};

/**
 * Toggle bonus printing
 */
Game.prototype.toggleBonusPrinting = function () {
    this.bonusPrinting = !this.bonusPrinting;

    clearTimeout(this.bonusPrintingTimeout);
    this.printingTimeout = setTimeout(this.toggleBonusPrinting, this.getRandomPrintingTime());
};

/**
 * Stop bonus printing
 */
Game.prototype.stopBonusPrinting = function()
{
    clearTimeout(this.bonusPrintingTimeout);

    this.printing = false;
};

/**
 * Make a bonus `pop'
 */
Game.prototype.popBonus = function () {
    if (this.bonuses.count() < this.bonusCap) {

        if (this.percentChance(this.bonusPoppingRate)) {
            var bonus = new Bonus('test', '#7CFC00');
                bonus.setPosition(this.world.getRandomPosition(bonus.radius, 0.1));
                bonus.pop();
            this.emit('bonus:pop', { game: this, bonus: bonus });
            this.bonuses.add(bonus);
        }
    }
};

/**
 * Has a percent of chance to return true
 *
 * @param percentTrue
 * @returns {boolean}
 */
Game.prototype.percentChance = function (percentTrue) {
    percentTrue = percentTrue || 100;

    return (Math.floor(Math.random()*101) <= percentTrue);
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
Game.prototype.getRandomPrintingTime = function()
{
    if (this.bonusPrinting) {
        return this.bonusPrintingTime * (0.2 + Math.random() * 0.8);
    } else {
        return this.noBonusPrintingTime * (0.8 + Math.random() * 0.5);
    }
};

/**
 * Reset bonus effects
 * Only velocity for now
 */
Game.prototype.resetBonusEffects = function () {
    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].resetVelocity();
    }
};

/**
 * Clear timeouts
 */
Game.prototype.clearTimeouts = function()
{
    for (var i = this.timeouts.length - 1; i >= 0; i--) {
        clearTimeout(this.timeouts[i]);
    }
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    if (BaseGame.prototype.end.call(this)) {
        this.world.clear();

        return true;
    }

    return false;
};
