/**
 * GameRepository
 *
 * @param {SocketClient} client
 * @param {RoomRepository} parent
 * @param {SoundManager} sound
 * @param {Notifier} notifier
 */
function GameRepository(client, parent, sound, notifier)
{
    EventEmitter.call(this);

    this.client     = client;
    this.parent     = parent;
    this.sound      = sound;
    this.compressor = new Compressor();
    this.game       = null;

    this.start        = this.start.bind(this);
    this.stop         = this.stop.bind(this);
    this.draw         = this.draw.bind(this);
    this.onGameStart  = this.onGameStart.bind(this);
    this.onGameStop   = this.onGameStop.bind(this);
    this.onBonusPop   = this.onBonusPop.bind(this);
    this.onBonusClear = this.onBonusClear.bind(this);
    this.onBonusStack = this.onBonusStack.bind(this);
    this.onPosition   = this.onPosition.bind(this);
    this.onAngle      = this.onAngle.bind(this);
    this.onPoint      = this.onPoint.bind(this);
    this.onDie        = this.onDie.bind(this);
    this.onProperty   = this.onProperty.bind(this);
    this.onRoundNew   = this.onRoundNew.bind(this);
    this.onRoundEnd   = this.onRoundEnd.bind(this);
    this.onClear      = this.onClear.bind(this);
    this.onBorderless = this.onBorderless.bind(this);
    this.onEnd        = this.onEnd.bind(this);
    this.onLeave      = this.onLeave.bind(this);
    this.onSpectate   = this.onSpectate.bind(this);
}

GameRepository.prototype = Object.create(EventEmitter.prototype);
GameRepository.prototype.constructor = GameRepository;

/**
 * Start
 */
GameRepository.prototype.start = function()
{
    if (this.parent.room) {
        this.game = this.parent.room.game;
        this.attachEvents();
        this.attachIdleEvents();
    }
};

/**
 * Pause
 */
GameRepository.prototype.stop = function()
{
    this.detachEvents();
    this.detachIdleEvents();
    this.game = null;
};

/**
 * Attach events
 */
GameRepository.prototype.attachEvents = function()
{
    this.client.on('game:start', this.onGameStart);
    this.client.on('game:stop', this.onGameStop);
    this.client.on('property', this.onProperty);
    this.client.on('position', this.onPosition);
    this.client.on('angle', this.onAngle);
    this.client.on('point', this.onPoint);
    this.client.on('die', this.onDie);
    this.client.on('bonus:pop', this.onBonusPop);
    this.client.on('bonus:clear', this.onBonusClear);
    this.client.on('bonus:stack', this.onBonusStack);
    this.client.on('round:new', this.onRoundNew);
    this.client.on('round:end', this.onRoundEnd);
    this.client.on('clear', this.onClear);
    this.client.on('borderless', this.onBorderless);
    this.client.on('end', this.onEnd);
    this.client.on('game:leave', this.onLeave);
    this.client.on('spectate', this.onSpectate);
};

/**
 * Attach events
 */
GameRepository.prototype.detachEvents = function()
{
    this.client.off('game:start', this.onGameStart);
    this.client.off('game:stop', this.onGameStop);
    this.client.off('property', this.onProperty);
    this.client.off('position', this.onPosition);
    this.client.off('angle', this.onAngle);
    this.client.off('point', this.onPoint);
    this.client.off('die', this.onDie);
    this.client.off('bonus:pop', this.onBonusPop);
    this.client.off('bonus:clear', this.onBonusClear);
    this.client.off('bonus:stack', this.onBonusStack);
    this.client.off('round:new', this.onRoundNew);
    this.client.off('round:end', this.onRoundEnd);
    this.client.off('clear', this.onClear);
    this.client.off('borderless', this.onBorderless);
    this.client.off('end', this.onEnd);
    this.client.off('game:leave', this.onLeave);
    this.client.off('spectate', this.onSpectate);
};

/**
 * Attach idle events
 */
GameRepository.prototype.attachIdleEvents = function()
{
    this.client.on('property', this.draw);
    this.client.on('position', this.draw);
    this.client.on('angle', this.draw);
};


/**
 * Detach idle events
 */
GameRepository.prototype.detachIdleEvents = function()
{
    this.client.off('property', this.draw);
    this.client.off('position', this.draw);
    this.client.off('angle', this.draw);
};

/**
 * Draw
 */
GameRepository.prototype.draw = function()
{
    if (!this.game.frame) {
        this.game.repaint();
    }
};

/**
 * On game start
 *
 * @param {Event} e
 */
GameRepository.prototype.onGameStart = function(e)
{
    this.game.start();
    this.detachIdleEvents();
    this.emit('game:start');
};

/**
 * On game stop
 *
 * @param {Event} e
 */
GameRepository.prototype.onGameStop = function(e)
{
    this.game.stop();
    this.attachIdleEvents();
    this.emit('game:stop');
};

/**
 * On property
 *
 * @param {Event} e
 */
GameRepository.prototype.onProperty = function(e)
{
    var data   = e.detail,
        avatar = this.game.avatars.getById(data[0]);

    if (avatar) {
        avatar.set(data[1], data[2]);
    }
};

/**
 * On position
 *
 * @param {Event} e
 */
GameRepository.prototype.onPosition = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.setPositionFromServer(
            this.compressor.decompress(e.detail[1]),
            this.compressor.decompress(e.detail[2])
        );
    }
};

/**
 * On point
 *
 * @param {Event} e
 */
GameRepository.prototype.onPoint = function(e)
{
    var avatar = this.game.avatars.getById(e.detail);

    if (avatar) {
        avatar.addPoint(avatar.x, avatar.y);
    }
};

/**
 * On angle
 *
 * @param {Event} e
 */
GameRepository.prototype.onAngle = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.setAngle(this.compressor.decompress(e.detail[1]));
    }
};

/**
 * On die
 *
 * @param {Event} e
 */
GameRepository.prototype.onDie = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar) {
        avatar.die();
        this.sound.play('death');
    }
};

/**
 * On bonus pop
 *
 * @param {Event} e
 */
GameRepository.prototype.onBonusPop = function(e)
{
    var bonus = new MapBonus(
        e.detail[0],
        this.compressor.decompress(e.detail[1]),
        this.compressor.decompress(e.detail[2]),
        e.detail[3]
    );

    this.game.bonusManager.add(bonus);
    this.sound.play('bonus-pop');
};

/**
 * On bonus clear
 *
 * @param {Event} e
 */
GameRepository.prototype.onBonusClear = function(e)
{
    var bonus = this.game.bonusManager.bonuses.getById(e.detail);

    if (bonus) {
        this.game.bonusManager.remove(bonus);
        this.sound.play('bonus-clear');
    }
};

/**
 * On bonus stack
 *
 * @param {Event} e
 */
GameRepository.prototype.onBonusStack = function(e)
{
    var avatar = this.game.avatars.getById(e.detail[0]);

    if (avatar && avatar.local) {
        avatar.bonusStack[e.detail[1]](new StackedBonus(e.detail[2], e.detail[3], e.detail[4]));
    }
};

/**
 * On round new
 *
 * @param {Event} e
 */
GameRepository.prototype.onRoundNew = function(e)
{
    this.game.newRound();
    this.emit('round:new');
};

/**
 * On round new
 *
 * @param {Event} e
 */
GameRepository.prototype.onRoundEnd = function(e)
{
    this.game.endRound();
    this.game.roundWinner = e.detail ? this.game.avatars.getById(e.detail) : null;
    this.emit('round:end');
};

/**
 * On clear
 *
 * @param {Event} e
 */
GameRepository.prototype.onClear = function(e)
{
    this.game.clearTrails();
};

/**
 * On borderless
 *
 * @param {Event} e
 */
GameRepository.prototype.onBorderless = function(e)
{
    this.game.setBorderless(e.detail);
    this.emit('borderless');
};

/**
 * On game end
 *
 * @param {Event} e
 */
GameRepository.prototype.onEnd = function(e)
{
    this.game.end();
    this.sound.play('win');
    this.emit('end');
};

/**
 * On leave
 *
 * @param {Event} e
 */
GameRepository.prototype.onLeave = function(e)
{
    var avatar = this.game.avatars.getById(e.detail);

    if (avatar) {
        this.game.removeAvatar(avatar);
    }
};

/**
 * On spectate
 */
GameRepository.prototype.onSpectate = function(e)
{
    var data = e.detail;

    this.game.maxScore = data.maxScore;

    for (var i = this.game.avatars.items.length - 1; i >= 0; i--) {
        this.game.avatars.items[i].local = true;
        this.game.avatars.items[i].ready = true;
    }

    if (data.inRound) {
        if (data.rendered) {
            this.game.newRound(0);
        } else {
            this.game.newRound();
        }
    } else {
        this.game.start();
    }

    this.emit('spectate');
};
