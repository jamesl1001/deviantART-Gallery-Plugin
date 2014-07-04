function deviantARTGalleryPlugin(username, id, ratio) {
    // Inject the gallery markup
    var gallery = document.getElementById('deviantART-gallery');
    gallery.innerHTML = '<div id="ss__wrapper"></div><div id="ss__controls"><div id="ss__prev"><div id="ss__prevChev"></div></div><div id="ss__next"><div id="ss__nextChev"></div></div><div id="ss__dots"></div></div></div>';

    var deviations = [];

    (function queryYQL() {
        // thanks http://stackoverflow.com/a/7369516/1696757
        var url = 'http://backend.deviantart.com/rss.xml?q=gallery:' + username + '/' + id;

        window['callback'] = callback;
        var s = document.createElement('script');
        s.src = "http://query.yahooapis.com/v1/public/yql?q=" + escape('select * from xml where url="' + url + '"') + "&_maxage=86400&format=json&callback=callback";
        document.body.appendChild(s);
        
        function callback(feed) {
            var items = feed.query.results.rss.channel.item;

            for(var i = 0, l = items.length; i < l; i++) {
                var object = {};

                object.title = items[i].title[0];
                object.image = items[i].content.url;

                deviations.push(object);
            }

            // async function is complete, move on
            processDeviations(deviations);
        }
    })();
}

function processDeviations(deviations) {
    var images = '';

    for(var i = 0, l = deviations.length; i < l; i++) {
        images += '<img src="' + deviations[i].image + '" alt="' + deviations[i].title + '"/>';
    }

    document.getElementById('ss__wrapper').innerHTML = images;

    simpleslider(ratio);
}

/*
  SimpleSlider v1.1 by JaL Productions
  http://jalproductions.co.uk/
  https://github.com/jamesl1001/simpleslider
*/

function simpleslider(ssR, ssF, ssD, ssP) {
    // Setup variables
    var ss              = document.getElementById('deviantART-gallery'),
        ssWrapper       = document.getElementById('ss__wrapper'),
        ssControls      = document.getElementById('ss__controls'),
        ssPrev          = document.getElementById('ss__prev'),
        ssNext          = document.getElementById('ss__next'),
        ssDots          = document.getElementById('ss__dots'),
        ssImages        = ssWrapper.getElementsByTagName('img'),
        ssFrames        = ssF || ssImages.length,
        ssRatio         = ssR,
        ssDirectory     = ssD,
        ssPrefix        = ssP,
        ssCurrentFrame  = 0,
        ssDotsWidth     = ssFrames * 20,
        ssWidth         = 0,
        ssHeight        = 0;

    // Calculate aspect ratio
    var ssRatioSplit      = ssRatio.split(':');
    var ssRatioPercentage = ssRatioSplit[1] / ssRatioSplit[0] * 100;

    // Set dimensions
    ss.style.paddingBottom = ssWrapper.style.paddingBottom = ssRatioPercentage + '%';
    ssDots.style.width     = ssDotsWidth + 'px';

    // Get pixel dimensions
    function getSSDimensions() {
        ssWidth  = ssWrapper.offsetWidth;
        ssHeight = ssWrapper.offsetHeight;
    }

    getSSDimensions();

    // Generate navigation dots
    for(var i = 0; i < ssFrames; i++) {
        var ssDot = document.createElement('div');
        ssDot.className = 'ss__dot' + ' ss__frame' + [i];
        ssDots.appendChild(ssDot);
    }

    ssAllDots = ssDots.getElementsByTagName('div');

    // Create img elements if they don't already exist on the DOM
    if(ssImages.length == 0) {
        for(var i = 1; i <= ssFrames; i++) {
            var ssImg = new Image();
            ssImg.src = ssD + '/' + ssP + i + '.jpg'; // 'img/directory/prefix1.jpg'
            ssWrapper.innerHTML += ssImg.outerHTML;
        }
        ssImages = ssWrapper.getElementsByTagName('img');
    }

    for(var i = 0, l = ssImages.length; i < l; i++) {
        coverImages(ssImages[i]);
    }

    // Ensure each image fills the wrapper leaving no whitespace (background-size:cover)
    function coverImages(imgElem) {

        var img = new Image();
        img.src = imgElem.src;

        var wait = setInterval(function() {
            if(img.width != 0 && img.height != 0) {
                clearInterval(wait);

                // Stretch to fit
                if((img.width / img.height) < (ssWidth / ssHeight)) {
                    imgElem.className += ' full-width';
                } else {
                    imgElem.className += ' full-height';
                }

                calculateCentre();
            }
        }, 0);
    }

    function calculateCentre() {
        for(var i = 0, l = ssImages.length; i < l; i++) {
            if(ssImages[i].width >= ssWidth) {
                ssImages[i].style.left = (ssWidth - ssImages[i].width) / 2 + 'px';
            }

            if(ssImages[i].height >= ssHeight) {
                ssImages[i].style.top = (ssHeight - ssImages[i].height) / 2 + 'px';
            }
        }
    }

    // Add current class to first frame
    function addCurrent(n) {
        ssImages[n].className += ' current';
        ssAllDots[n].className += ' current';
    }

    // Clear all current classes
    function clearCurrent() {
        for(var i = 0; i < ssFrames; i++) {
            ssImages[i].className = ssImages[i].className.replace(/ current/, '');
            ssAllDots[i].className = ssAllDots[i].className.replace(/ current/, '');
        }
    }

    // Update current frame
    function goToFrame(n) {
        if(n >= ssFrames) {
            ssCurrentFrame = 0;
        } else if(n < 0) {
            ssCurrentFrame = ssFrames - 1;
        } else {
            ssCurrentFrame = n;
        }
    }

    // Always initialise first image as .current
    addCurrent(0);

    // Next and Previous click handlers
    if(window.addEventListener) {
        ssPrev.addEventListener('click', clickPrev);
        ssNext.addEventListener('click', clickNext);
    } else if(window.attachEvent) {
        ssPrev.attachEvent('onclick', clickPrev);
        ssNext.attachEvent('onclick', clickNext);
    }

    function clickPrev() {
        clearCurrent();
        goToFrame(ssCurrentFrame - 1);
        addCurrent(ssCurrentFrame);
    }

    function clickNext() {
        clearCurrent();
        goToFrame(ssCurrentFrame + 1);
        addCurrent(ssCurrentFrame);
    }

    // Navigation dots click handlers
    for(var i = 0; i < ssFrames; i++) {
        if(window.addEventListener) {
            ssAllDots[i].addEventListener('click', clickDots);
        } else if(window.attachEvent) {
            ssAllDots[i].attachEvent('onclick', clickDots);
        }
    }

    function clickDots(e) {
        if(e.target) {
            var dotClicked = e.target.className;
        } else if(e.srcElement) {
            var dotClicked = e.srcElement.className;
        }
        var n = dotClicked.match(/\d/);
        clearCurrent();
        goToFrame(parseInt(n[0]));
        addCurrent(n[0]);
    }

    document.onkeydown = function(e) {
        evt = e || window.event;
        switch(evt.keyCode) {
            case 37:
                clickPrev();
                break;
            case 39:
                clickNext();
                break;
        }
    };

    // Recalculate image centres on window resize
    if(window.addEventListener) {
        window.addEventListener('resize', windowResize);
    } else if(window.attachEvent) {
        window.attachEvent('onresize', windowResize);
    }

    function windowResize() {
        getSSDimensions();
        calculateCentre();
    }
}