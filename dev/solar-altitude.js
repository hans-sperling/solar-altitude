function SolarAltitude(win, doc, $) {
    var priv = {}, pub = {};

    // ----------------------------------------------------------------------------------------------- Private

    priv.shapes = {
        world: $('.application'),
        north: $('#north'),
        east:  $('#east'),
        south: $('#south'),
        west:  $('#west')
    };

    priv.time = 12; // 00:00 - 24:00

    priv.worldColor = {
        r: 255,
        g: 255,
        b: 255
    };

    priv.cubeColor = {
        north: { r: 127, g: 127, b: 127 },
        east:  { r: 127, g: 127, b: 127 },
        south: { r: 127, g: 127, b: 127 },
        west:  { r: 127, g: 127, b: 127 }
    };

    priv.sunColor = {
        north: { r: 0,   g: 0,   b: 127 },
        east:  { r: 127, g: 0,   b: 0   },
        south: { r: 127, g: 127, b: 0   },
        west:  { r: 127, g: 0,   b: 0   }
    };

    priv.currentColor = {
        north: { r: 127, g: 127, b: 127 },
        east:  { r: 127, g: 127, b: 127 },
        south: { r: 127, g: 127, b: 127 },
        west:  { r: 127, g: 127, b: 127 }
    };


    priv.getBrightness = function getBrightness(time) {
        var brightness = 0;

        if (time >= 0 && time < 12) {
            brightness = ((100 / 12) * time);
        }
        else {
            brightness = 100 - ((100 / 12) * (time-12));
        }

        return brightness;
    };

    // ------------------------------------------------------------------------------------------------ Public

    pub.init = function () {
        pub.updateColors();

        // Simulate a day
        /** /
        setInterval(function() {
            priv.time += 0.1;
            if (priv.time >= 24) {
                priv.time = 0;
            }
            pub.updateColors();
        }, 100);
        /**/
    };

    priv.getBrightness = function getBrightness(time) {
        var brightness = 0;

        if (time >= 0 && time < 12) {
            brightness = ((100 / 12) * time);
        }
        else {
            brightness = 100 - ((100 / 12) * (time-12));
        }

        return brightness;
    };

    pub.updateColors = function updateColors() {
        var step = {
                r: (priv.worldColor.r / 100),
                g: (priv.worldColor.g / 100),
                b: (priv.worldColor.b / 100)
            },
            brightness = priv.getBrightness(priv.time),
            r          = Math.round(step.r * brightness),
            g          = Math.round(step.g * brightness),
            b          = Math.round(step.b * brightness);

        // Logging
        /** /
        console.log(brightness);
        console.log(r);
        console.log(g);
        console.log(b);
        /**/

        // Render
        priv.shapes.world.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');
    };

    // ------------------------------------------------------------------------------------------------ Return

    return pub;

}

// ----------------------------------------------------------------------------------------------------- Run application

jQuery(document).ready(function() {
    'use strict';

    var solarAltitude = new SolarAltitude(window, document, jQuery);

    solarAltitude.init();
});
