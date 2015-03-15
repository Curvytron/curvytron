/**
 * Radio
 *
 * @param {Profile} profile
 */
function Radio (profile)
{
    this.profile = profile;
    this.element = this.getVideo(this.source);
    this.active  = this.profile.radio;

    this.toggle = this.toggle.bind(this);
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
Radio.prototype.getVideo = function(src)
{
    var video = document.createElement('video'),
        source = document.createElement('source');

    video.appendChild(source);

    video.name     = 'media';
    video.autoplay = true;
    video.volume   = this.active ? this.volume : 0;
    source.type    = 'audio/mpeg';
    source.src     = this.source;

    return video;
};

/**
 * Toggle active
 */
Radio.prototype.toggle = function ()
{
    this.setActive(!this.active);
};

/**
 * Set active/inactive
 *
 * @param {Boolean} active
 */
Radio.prototype.setActive = function(active)
{
    this.active = active ? true : false;
    this.setVolume(this.active ? this.volume : 0);
    this.profile.setRadio(this.active);
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
 * Play
 */
Radio.prototype.play = function()
{
    if (this.active) {
        this.setVolume();
    }
};

/**
 * Stop
 */
Radio.prototype.stop = function(save)
{
    this.setVolume(0);
};
