/**
 * Radio
 *
 * @param {Profile} profile
 */
function Radio (profile)
{
    this.profile = profile;
    this.element = this.getVideo(this.source);

    this.toggle = this.toggle.bind(this);
}

/**
 * Source URL
 *
 * @type {String}
 */
Radio.prototype.source = 'http://streaming.radionomy.com/Curvytron';

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
    video.volume   = this.profile.radio ? this.volume : 0;
    source.type    = 'audio/mpeg';
    source.src     = this.source;

    return video;
};

/**
 * Toggle
 */
Radio.prototype.toggle = function()
{
    if (this.element.volume) {
        this.stop();
    } else {
        this.play();
    }
};

/**
 * Play
 */
Radio.prototype.play = function()
{
    this.element.volume = this.volume;
    this.profile.setRadio(true);
};

/**
 * Stop
 */
Radio.prototype.stop = function()
{
    this.element.volume = 0;
    this.profile.setRadio(false);
};
