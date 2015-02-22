/**
 * Sound Manager
 *
 * @param {Profile} profile
 */
function SoundManager (profile)
{
    this.profile = profile;
    this.active  = this.profile.sound;
    this.volume  = 0.5;

    createjs.Sound.alternateExtensions = ['mp3'];
    createjs.Sound.registerSounds(this.sounds, this.directory);
    createjs.Sound.setVolume(this.active ? this.volume : 0);
}

/**
 * Sounds
 *
 * @type {Array}
 */
SoundManager.prototype.sounds = [
    {id:'notice', src:'loose.ogg'},
    {id:'loose', src:'loose.ogg'},
    {id:'win', src:'win.ogg'}
];

/**
 * Directory
 *
 * @type {String}
 */
SoundManager.prototype.directory = 'sounds/';

/**
 * Play a sound
 *
 * @param {String} sound
 */
SoundManager.prototype.play = function(sound)
{
    createjs.Sound.play(sound);
};

/**
 * Sound manager
 *
 * @param {String} sound
 */
SoundManager.prototype.stop = function(sound)
{
    createjs.Sound.stop(sound);
};

/**
 * Toggle active
 */
SoundManager.prototype.toggle = function ()
{
    this.setActive(!this.active);
};

/**
 * Set active/inactive
 *
 * @param {Boolean} active
 */
SoundManager.prototype.setActive = function(active)
{
    this.active = active ? true : false;
    createjs.Sound.setVolume(this.active ? this.volume : 0);
    this.profile.setSound(this.active);
};
