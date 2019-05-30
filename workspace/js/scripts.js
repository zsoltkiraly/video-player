/*
Video player - Code by Zsolt Király
v1.0.6 - 2019-05-30
*/

'use strict';
var responsiveIframeVideo = function() {

    function signatura() {
        if (window['console']) {
            const text = {
                black: '%c     ',
                blue: '%c   ',
                author: '%c  Zsolt Király  ',
                github: '%c  https://zsoltkiraly.com/'
            }

            const style = {
                black: 'background: #282c34',
                blue: 'background: #61dafb',
                author: 'background: black; color: white',
                github: ''
            }

            console.log(text.black + text.blue + text.author + text.github, style.black, style.blue, style.author, style.github);
        }
    }

    signatura();

    function hasTouch() {
        return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    
    if (hasTouch()) {
        try {
            for (var si in document.styleSheets) {
                var styleSheet = document.styleSheets[si];
                if (!styleSheet.rules) continue;
    
                for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                    if (!styleSheet.rules[ri].selectorText) continue;
    
                    if (styleSheet.rules[ri].selectorText.match(':hover')) {
                        styleSheet.deleteRule(ri);
                    }
                }
            }
        } catch (ex) {}
    }
    

    function _getWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }


    function _setAspectratio(i, c) {
        const video = i.querySelector('iframe[src*="' + c.videoPlayer + '"]'),
            videoWrapper = i.querySelector('.video-wrapper');

        videoWrapper.style.paddingBottom = c.aspectratio + '%';

        var width = video.offsetWidth,
            height = video.offsetHeight;

        if(width && height) {
            video.setAttribute('data-aspectratio', height / width);

            video.removeAttribute('width');
            video.removeAttribute('height');
        }
    }

    function _videoPlayer(i, c) {
        const video = i.querySelector('iframe[src*="' + c.videoPlayer + '"]'),
            newWidth = video.closest('.video-wrapper').offsetWidth;

        if(newWidth) {

            video.setAttribute('width', newWidth);
            video.setAttribute('height', newWidth * parseFloat(video.getAttribute('data-aspectratio')));
        }
    }

    function _embedVideo(i, c) {

        const videoPlay = document.querySelector('#' + c.boxContainer + '');

        if(videoPlay) {

            const play = videoPlay.querySelector('.play');

            if(play) {

                const videoWrapper = i.querySelector('.video-wrapper'),
                    backgroundImg = videoWrapper.querySelector('.video-content .background-img'),
                    textContent = videoWrapper.querySelector('.text-content'),
                    iframeClass = videoWrapper.querySelector('.iframe');

                iframeClass.innerHTML = '<iframe src="' + c.iframeSrc + '" width="100%" height="100%" frameborder="0" allowfullscreen="" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

                play.addEventListener('click', function() {

                    iframeClass.innerHTML = '<iframe src="' + c.iframeSrc + c.setParamters + '" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

                    textContent.classList.add('margin-left');
                    iframeClass.classList.add('active');

                    setTimeout(() => {

                        this.classList.add('opacity-hide');
                        backgroundImg.classList.add('opacity-hide');

                        setTimeout(() => {

                            iframeClass.classList.add('opacity-hide');
                        }, 50);

                        setTimeout(() => {

                            this.classList.add('hide');
                            textContent.classList.add('hide');
                            backgroundImg.classList.add('hide');
                            iframeClass.classList.remove('black');
                        }, 1500);
                    }, 500);

                }, false);
            }
        }
    }

    function app(c) {
        const id = document.querySelector('#' + c.boxContainer + '');

        if(id) {
            var cachedWidth = _getWidth();

            _embedVideo(id, c);
            _videoPlayer(id, c);

            window.addEventListener('resize', function() {
                var newWidth = _getWidth();

                if(newWidth !== cachedWidth) {
                    _videoPlayer(id, c);
                }
            }, false);

            _setAspectratio(id, c);
        }
    }

    return {
        app: app
    }
}();