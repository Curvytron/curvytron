/**
 * Radio
 *
 * @param {Profile} profile
 */
function Radio (profile)
{
    this.profile = profile;
    this.active  = false;
    this.enabled = this.profile.radio;
    this.element = this.getVideo();

    this.toggle = this.toggle.bind(this);

    this.resolve();
}

/**
 * Source URL
 *
 * @type {String}
 */
Radio.prototype.source = 'http://streaming.radionomy.com/Curvyradio';

/**
 * Volume
 *
 * @type {Number}
 */
Radio.prototype.volume = 0.8;

/**
 * Get video
 *
 * @param {String} src
 *
 * @return {DOMElement}
 */
Radio.prototype.getVideo = function()
{
    var video  = document.createElement('video'),
        source = document.createElement('source');

    video.appendChild(source);

    video.name     = 'media';
    video.autoplay = true;
    video.volume   = this.volume;
    source.type    = 'audio/mpeg';

    return video;
};

/**
 * Toggle enabled
 */
Radio.prototype.toggle = function ()
{
    this.setEnabled(!this.enabled);
};

/**
 * Set enabled/disabled (controlled by the user)
 *
 * @param {Boolean} enabled
 */
Radio.prototype.setEnabled = function(enabled)
{
    this.enabled = enabled ? true : false;

    this.profile.setRadio(this.enabled);
    this.resolve();
};

/**
 * Set active/inactive (controlled by the game)
 *
 * @param {Boolean} enabled
 */
Radio.prototype.setActive = function(active)
{
    this.active = active ? true : false;

    this.resolve();
};

/**
 * Set volume
 *
 * @param {Number} volume
 */
Radio.prototype.setVolume = function(volume)
{
    this.element.volume = typeof(volume) !== 'undefined' ? volume : this.volume;
};

/**
 * Resolve radio status
 */
Radio.prototype.resolve = function()
{
    if (this.active && this.enabled) {
        this.play();
    } else {
        this.stop();
    }
};

/**
 * Play
 */
Radio.prototype.play = function()
{
    this.element.src = this.source;
};

/**
 * Stop
 */
Radio.prototype.stop = function()
{
    this.element.src = '';
};
