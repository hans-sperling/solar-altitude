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

    priv.brightness = {
        min: 25,
        max: 100
    };
    priv.time = 6; // 00:00 - 24:00

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
        sunrise:  { r: 255, g: 0, b: 0 },
        midday:   { r: 255, g: 255, b: 200 },
        sunset:   { r: 255, g: 255, b: 255 },
        midnight: { r: 255, g: 255, b: 255 }
    };


    // Returns percentage brightness
    priv.getBrightness = function getBrightness(time) {
        var min        = priv.brightness.min,
            max        = priv.brightness.max,
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
        var solarColor = { r:0, g:0, b:0 },
            factor     = 6, // hours per day-zone
            startColor, endColor;

        if (time >= 0 && time < 6) {
            startColor = priv.solarColor.midnight;
            endColor   = priv.solarColor.sunrise;

            solarColor.r = startColor.r + (((time) * (endColor.r - startColor.r)) / factor);
            solarColor.g = startColor.g + (((time) * (endColor.g - startColor.g)) / factor);
            solarColor.b = startColor.b + (((time) * (endColor.b - startColor.b)) / factor);
        }
        else if (time >= 6 && time < 12) {
            startColor = priv.solarColor.sunrise;
            endColor   = priv.solarColor.midday;

            solarColor.r = startColor.r + (((time - 6) * (endColor.r - startColor.r)) / factor);
            solarColor.g = startColor.g + (((time - 6) * (endColor.g - startColor.g)) / factor);
            solarColor.b = startColor.b + (((time - 6) * (endColor.b - startColor.b)) / factor);
        }
        else if (time >= 12 && time <= 18 ) {
            startColor = priv.solarColor.midday;
            endColor   = priv.solarColor.sunset;

            solarColor.r = startColor.r + (((time - 12) * (endColor.r - startColor.r)) / factor);
            solarColor.g = startColor.g + (((time - 12) * (endColor.g - startColor.g)) / factor);
            solarColor.b = startColor.b + (((time - 12) * (endColor.b - startColor.b)) / factor);
        }
        else if (time >= 18 && time < 24 ) {
            startColor = priv.solarColor.sunset;
            endColor   = priv.solarColor.midnight;

            solarColor.r = startColor.r + (((time - 18) * (endColor.r - startColor.r)) / factor);
            solarColor.g = startColor.g + (((time - 18) * (endColor.g - startColor.g)) / factor);
            solarColor.b = startColor.b + (((time - 18) * (endColor.b - startColor.b)) / factor);
        }




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
            console.log('Time: ', priv.time);
        }, 100);
        /**/
    };

    pub.updateColors = function updateColors() {
        var brightness = 100,
            solarColor = { r: 255, g: 255, b: 255 },
            r, g, b;


        // Dynamic light and brightness
        /** /
        brightness = priv.getBrightness(priv.time);
        solarColor = priv.getSolarColor(priv.time);
        /**/

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
