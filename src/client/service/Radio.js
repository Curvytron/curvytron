/**
 * Radio
 */
function Radio ()
{
    this.element = this.getVideo(this.source);
    this.playing = true;
}

/**
 * Source URL
 *
 * @type {String}
 */
Radio.prototype.source = 'http://streaming.radionomy.com/Curvytron';

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
    source.type    = "audio/mpeg";
    source.src     = this.source;

    return video;
};

/**
 * Toggle
 */
Radio.prototype.toggle = function()
{
    if (this.playing) {
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
    this.playing = true;
    this.element.volume = 1;
};

/**
 * Stop
 */
Radio.prototype.stop = function()
{
    this.playing = false;
    this.element.volume = 0;
};
