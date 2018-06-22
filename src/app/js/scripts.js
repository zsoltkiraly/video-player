'use strict';

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

var forEach = function(array, callback, scope) {
    var i = 0,
        len = array.length;
    if (len > 0) {
        for (; i < len; i++) {
            callback.call(scope, i, array[i]);
        }
    }
}

function getWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

/*
Video player - Code by Zsolt Király
v1.0.5 - 2018-02-24
*/
var responsiveIframeVideo = function() {

    function findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }

    function setAspectratio(i, c) {
        var video = i.querySelector('iframe[src*="' + c.videoPlayer + '"]'),
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

    function youtube(i, c) {
        var video = i.querySelector('iframe[src*="' + c.videoPlayer + '"]');

        var newWidth = findAncestor(video, 'video-wrapper').offsetWidth;

        if(newWidth) {
            video.setAttribute('width', newWidth);
            video.setAttribute('height', newWidth * parseFloat(video.getAttribute('data-aspectratio')));
        }
    }

    function embedVideo(i, c) {
        var videoPlay = document.querySelector('#' + c.boxContainer + '');

        if(videoPlay) {
            var play = videoPlay.querySelector('.play');

            if(play) {
                var videoWrapper = i.querySelector('.video-wrapper'),
                    backgroundImg = videoWrapper.querySelector('.video-content .background-img'),
                    iframe = videoWrapper.querySelector('.video-content .iframe'),
                    textContent = videoWrapper.querySelector('.text-content'),
                    iframeClass = videoWrapper.querySelector('.iframe'),
                    iframe = iframeClass.querySelector('iframe');

                iframeClass.innerHTML = '<iframe src="' + c.iframeSrc + c.setParamters + '" width="100%" height="100%" frameborder="0" allowfullscreen="" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

                play.addEventListener('click', function() {

                    var obj = this,
                        videoWrapper = findAncestor(obj, 'video-wrapper'),
                        iframeSrcNew = videoWrapper.querySelector('iframe').getAttribute('src');

                    iframeClass.innerHTML = '<iframe src="' + iframeSrcNew + '" width="100%" height="100%" frameborder="0" allowfullscreen="" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

                    textContent.classList.add('margin-left');
                    iframeClass.classList.add('active');

                    setTimeout(function() {
                        obj.classList.add('opacity-hide');
                        backgroundImg.classList.add('opacity-hide');

                        setTimeout(function() {
                            iframeClass.classList.add('opacity-hide');
                        }, 50);

                        setTimeout(function() {
                            obj.classList.add('hide');
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
        var id = document.querySelector('#' + c.boxContainer + '');

        if(id) {
            var cachedWidth = getWidth();

            embedVideo(id, c);
            youtube(id, c);

            window.addEventListener('resize', function() {
                var newWidth = getWidth();

                if(newWidth !== cachedWidth) {
                    youtube(id, c);
                }
            }, false);

            setAspectratio(id, c);
        }
    }

    return {
        app: app
    }
}();