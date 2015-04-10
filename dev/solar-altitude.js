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
        sunrise:  { r: 255, g: 0,   b: 0   },
        midday:   { r: 255, g: 255, b: 0   },
        sunset:   { r: 255, g: 0,   b: 0   },
        moonrise: { r: 0,   g: 0,   b: 50  },
        midnight: { r: 0,   g: 0,   b: 100 },
        moonset:  { r: 0,   g: 0,   b: 50  }
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

    priv.getSolarColor = function getSolarColor(time) {
        var solarColor = { r: 255, g: 255, b: 255 };




        return solarColor;
    };

    // ------------------------------------------------------------------------------------------------ Public

    pub.init = function () {
        pub.updateColors();

        // Simulate a day
        /** /
        setInterval(function() {
            priv.time += 1;
            if (priv.time >= 24) {
                priv.time = 0;
            }
            pub.updateColors();
        }, 100);
        /**/
    };

    pub.updateColors = function updateColors() {
        var brightness = priv.getBrightness(priv.time),
            solarColor = priv.getSolarColor(priv.time),
            r, g, b;

        // Render world color
        r = Math.round((priv.worldColor.r + solarColor.r) / 200 * brightness);
        g = Math.round((priv.worldColor.g + solarColor.g) / 200 * brightness);
        b = Math.round((priv.worldColor.b + solarColor.b) / 200 * brightness);
        priv.shapes.world.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round((priv.cubeColor.north.r + solarColor.r) / 200 * brightness);
        g = Math.round((priv.cubeColor.north.g + solarColor.g) / 200 * brightness);
        b = Math.round((priv.cubeColor.north.b + solarColor.b) / 200 * brightness);
        priv.shapes.north.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round((priv.cubeColor.east.r + solarColor.r) / 200 * brightness);
        g = Math.round((priv.cubeColor.east.g + solarColor.g) / 200 * brightness);
        b = Math.round((priv.cubeColor.east.b + solarColor.b) / 200 * brightness);
        priv.shapes.east.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round((priv.cubeColor.south.r + solarColor.r) / 200 * brightness);
        g = Math.round((priv.cubeColor.south.g + solarColor.g) / 200 * brightness);
        b = Math.round((priv.cubeColor.south.b + solarColor.b) / 200 * brightness);
        priv.shapes.south.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round((priv.cubeColor.west.r + solarColor.r) / 200 * brightness);
        g = Math.round((priv.cubeColor.west.g + solarColor.g) / 200 * brightness);
        b = Math.round((priv.cubeColor.west.b + solarColor.b) / 200 * brightness);
        priv.shapes.west.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Logging
        /** /
        console.log(brightness);
        console.log(solarColor);
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
