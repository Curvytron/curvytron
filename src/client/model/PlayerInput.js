/**
 * Player input
 */
function PlayerInput(avatar)
{
    EventEmitter.call(this);

    this.avatar = avatar;
    this.key    = false;
    this.active = [false, false];
    this.move   = 0;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp   = this.onKeyUp.bind(this);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
}

PlayerInput.prototype = Object.create(EventEmitter.prototype);

/**
 * Key binding
 *
 * @type {Object}
 */
PlayerInput.prototype.binding = [37, 39];

/**
 * On Key Down
 *
 * @param {Event} e
 */
PlayerInput.prototype.onKeyDown = function(e)
{
    var index = this.binding.indexOf(e.keyCode);

    if (index >= 0) {
        this.setActive(index, true);
    }
};

/**
 * On Key Down
 *
 * @param {Event} e
 */
PlayerInput.prototype.onKeyUp = function(e)
{
    var index = this.binding.indexOf(e.keyCode);

    if (index >= 0) {
        this.setActive(index, false);
    }
};

/**
 * Resolve
 *
 * @param {Number} index
 * @param {Boolean} pressed
 */
PlayerInput.prototype.setActive = function(index, pressed)
{
    this.active[index] = pressed;
    this.resolve();
};

/**
 * Resolve
 */
PlayerInput.prototype.resolve = function()
{
    var move = (this.active[0] !== this.active[1]) ? (this.active[0] ? -1 : 1) : false;

    if (this.move !== move) {
        this.setMove(move);
    }
};

/**
 * Set move
 *
 * @param {Boolean} move
 */
PlayerInput.prototype.setMove = function(move)
{
    this.move = move;

    this.emit('move', {avatar: this.avatar, move: move});
};