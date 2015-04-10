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

    priv.solarColor = {
        sunrise:  { r: 100, g: 0,   b: 0   },
        midday:   { r: 100, g: 100, b: 0   },
        sunset:   { r: 100, g: 0,   b: 0   },
        moonrise: { r: 0,   g: 0,   b: 50  },
        midnight: { r: 0,   g: 0,   b: 100 },
        moonset:  { r: 0,   g: 0,   b: 50  }
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

    // Returns percentage brightness
    priv.getBrightness = function getBrightness(time) {
        var min        = 25,
            max        = 100,
            brightness = min;

        if (time >= 0 && time < 12) {
            brightness = min + ((time * (max - min)) / 12);
        }
        else if (time >= 12 && time <= 24 ) {
            brightness = max - (((time - 12) * (max - min)) / 12);
        }

        return brightness;
    };

    pub.updateColors = function updateColors() {
        var brightness = priv.getBrightness(priv.time),
            r, g, b;

        // Render world color
        r = Math.round((priv.worldColor.r / 100) * brightness);
        g = Math.round((priv.worldColor.g / 100) * brightness);
        b = Math.round((priv.worldColor.b / 100) * brightness);
        priv.shapes.world.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');


        // Render north color
        r = Math.round((priv.cubeColor.north.r / 100) * brightness);
        g = Math.round((priv.cubeColor.north.g / 100) * brightness);
        b = Math.round((priv.cubeColor.north.b / 100) * brightness);
        priv.shapes.north.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round((priv.cubeColor.east.r / 100) * brightness);
        g = Math.round((priv.cubeColor.east.g / 100) * brightness);
        b = Math.round((priv.cubeColor.east.b / 100) * brightness);
        priv.shapes.east.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round((priv.cubeColor.south.r / 100) * brightness);
        g = Math.round((priv.cubeColor.south.g / 100) * brightness);
        b = Math.round((priv.cubeColor.south.b / 100) * brightness);
        priv.shapes.south.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round((priv.cubeColor.west.r / 100) * brightness);
        g = Math.round((priv.cubeColor.west.g / 100) * brightness);
        b = Math.round((priv.cubeColor.west.b / 100) * brightness);
        priv.shapes.west.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Logging
        /** /
        console.log(brightness);
        console.log(r);
        console.log(g);
        console.log(b);
        /**/
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
