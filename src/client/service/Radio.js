/**
 * Radio
 */
function Radio ()
{
    this.element = this.getVideo(this.source);
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
    video.volume   = 0;
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
    this.element.volume = 1;
};

/**
 * Stop
 */
Radio.prototype.stop = function()
{
    this.element.volume = 0;
};
