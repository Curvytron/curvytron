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
    this.client  = new SocketGroup(this.clients);

    this.addPoint             = this.addPoint.bind(this);
    this.onDie                = this.onDie.bind(this);
    this.bonusPrinting        = false;
    this.bonusPrintingTimeout = null;

    this.toggleBonusPrinting = this.toggleBonusPrinting.bind(this);

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.game = this;
        avatar.clear();
        avatar.on('point', this.addPoint);
        avatar.on('die', this.onDie);
        avatar.setMask(i+1);
    }
}

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
Game.prototype.trailLatency = 300;

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    BaseGame.prototype.update.call(this, step);

    var avatar, bonus;

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        if (avatar.alive && !this.world.testCircle(avatar.update(step))) {
            avatar.die();
        }

        if (this.bonusPrinting) {
            this.popBonus();
        }

        // check if a bonus has been taken
        for (var i = this.bonuses.ids.length - 1; i >= 0; i--) {
            bonus = this.bonuses.items[i];

            if (bonus.isTakenBy(avatar)) {
                // sample speed bonus test
                bonus.clear();
                this.emit('bonus:clear', bonus.serialize());
                avatar.upVelocity();
                setTimeout(function() { avatar.downVelocity() }, 3333);
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
    if (this.world.active) {
        var world = this.world,
            circle = [data.point[0], data.point[1], data.avatar.radius, data.avatar.mask];

        setTimeout(function () { circle[3] = 0; }, this.trailLatency);

        world.addCircle(circle);
    }
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
 * Add point
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
        var avatar, bonus, position;

        this.world.clear();

        this.inRound = true;
        this.deaths.clear();

        for (var i = this.avatars.items.length - 1; i >= 0; i--) {
            avatar = this.avatars.items[i];

            avatar.clear();
            avatar.setPosition(this.world.getRandomPosition(avatar.radius, 0.1));
            avatar.setAngle(Math.random() * Math.PI * 2);
        }

        for (var i = this.bonuses.ids.length - 1; i >= 0; i--) {
            bonus = this.bonuses.items[i];
            bonus.clear();
            this.emit('bonus:clear', bonus.serialize());
            this.bonuses.removeById(bonus.id);
        }

        BaseGame.prototype.newRound.call(this);

        this.emit('round:new', {game: this});
    }
};

/**
 * On start
 */
Game.prototype.onStart = function()
{
    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        avatar.printingTimeout = setTimeout(avatar.togglePrinting, 3000);
    }

    this.world.activate();
   
    // toggle bonuses printing
    setTimeout(this.toggleBonusPrinting, 3000);

    BaseGame.prototype.start.call(this);
};

/**
 *
 */
Game.prototype.toggleBonusPrinting = function () {
    this.bonusPrinting = !this.bonusPrinting;

    clearTimeout(this.bonusPrintingTimeout);
    this.printingTimeout = setTimeout(this.toggleBonusPrinting, this.getRandomPrintingTime());
}

/**
 * Stop printing
 */
Game.prototype.stopBonusPrinting = function()
{
    clearTimeout(this.printingTimeout);

    this.printing = false;
};

/**
 *
 */
Game.prototype.popBonus = function () {
    if (this.bonuses.count() < this.bonusCap) {
        if (this.chancePercent(this.bonusPoppingRate)) {
            var bonus = new Bonus('test', '#7CFC00');
                bonus.setPosition(this.world.getRandomPosition(bonus.radius, 0.1));
                bonus.pop();
            this.emit('bonus:pop', bonus.serialize());
            this.bonuses.add(bonus);
        }
    }
}

/**
 *
 * @param percentTrue
 * @returns {boolean}
 */
Game.prototype.chancePercent = function (percentTrue) {
    percentTrue = percentTrue || 100;
    if(Math.floor(Math.random()*101) <= percentTrue) {
        return true;
    }
    return false;
}

/**
 * Get random printing time
 *
 * @return {Number}
 */
Game.prototype.getRandomPrintingTime = function()
{
    if (this.bonusPrinting) {
        return this.printingTime * (0.2 + Math.random() * 0.8);
    } else {
        return this.noPrintingTime * (0.8 + Math.random() * 0.5);
    }
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    BaseGame.prototype.end.call(this)
    this.world.clear();
};
