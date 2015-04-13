function SolarAltitude(win, doc, $, domId, cubeColor) {
    var priv = {}, pub = {};

    // ----------------------------------------------------------------------------------------------- Private

    priv.shapes = {
        world: $(domId),
        north: $(domId + ' .north'),
        east:  $(domId + ' .east'),
        south: $(domId + ' .south'),
        west:  $(domId + ' .west'),
        roof:  $(domId + ' .roof')
    };

    priv.brightness = {
        min: 25,
        max: 100
    };

    priv.time = 0; // 00:00 - 24:00

    priv.worldColor = {
        r: 255,
        g: 255,
        b: 255
    };

    /**/
    priv.cubeColor = cubeColor;

    /**/
    priv.solarColor = {
        sunrise:  { r: 255, g: 0,   b: 0   },
        midday:   { r: 255, g: 255, b: 0   },
        sunset:   { r: 255, g: 0,   b: 0   },
        midnight: { r: 0,   g: 0,   b: 255 }
    };/**/
    /** /
    priv.solarColor = {
        sunrise:  { r: 255, g: 255, b: 255 },
        midday:   { r: 255, g: 255, b: 255 },
        sunset:   { r: 255, g: 255, b: 255 },
        midnight: { r: 255, g: 255, b: 255 }
    };/**/

    /** /
    priv.solarColor = {
        sunrise:  { r: 255, g: 255, b: 0 },
        midday:   { r: 255, g: 255, b: 0 },
        sunset:   { r: 255, g: 255, b: 0 },
        midnight: { r: 255, g: 255, b: 0 }
    };/**/


    // Returns percentage brightness
    priv.getBrightness = function getBrightness(time) {
        var min        = priv.brightness.min,
            max        = priv.brightness.max;

        // ((((min - max) * Math.cos(((Math.PI * time) * 2 / 24))) + max + min) / 2);
        return ((((min - max) * Math.cos(((Math.PI * time) / 12))) + max + min) / 2);
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


    priv.getSolarIntensity = function getSolarIntensity(time) {
        var intensity = {
                north: 0,
                east:  0,
                south: 0,
                west:  0,
                roof:  0
            },
            factor = 6,
            startNorth, endNorth,
            startEast,  endEast,
            startSouth, endSouth,
            startWest,  endWest,
            roof;

        if (time >= 0 && time < 6) {
            startNorth = 1.0;
            endNorth   = 0.5;
            startEast  = 0.5;
            endEast    = 1.0;
            startSouth = 0.0;
            endSouth   = 0.5;
            startWest  = 0.5;
            endWest    = 0.0;

            intensity.north = startNorth + ((time * (endNorth - startNorth)) / factor);
            intensity.east  = startEast  + ((time * (endEast  - startEast))  / factor);
            intensity.south = startSouth + ((time * (endSouth - startSouth)) / factor);
            intensity.west  = startWest  + ((time * (endWest  - startWest))  / factor);
        }
        else if (time >= 6 && time < 12) {
            startNorth = 0.5;
            endNorth   = 0.0;
            startEast  = 1.0;
            endEast    = 0.5;
            startSouth = 0.5;
            endSouth   = 1.0;
            startWest  = 0.0;
            endWest    = 0.5;

            intensity.north = startNorth + (((time - 6) * (endNorth - startNorth)) / factor);
            intensity.east  = startEast  + (((time - 6) * (endEast  - startEast))  / factor);
            intensity.south = startSouth + (((time - 6) * (endSouth - startSouth)) / factor);
            intensity.west  = startWest  + (((time - 6) * (endWest  - startWest))  / factor);
        }
        else if (time >= 12 && time <= 18 ) {
            startNorth = 0.0;
            endNorth   = 0.5;
            startEast  = 0.5;
            endEast    = 0.0;
            startSouth = 1.0;
            endSouth   = 0.5;
            startWest  = 0.5;
            endWest    = 1.0;

            intensity.north = startNorth + (((time - 12) * (endNorth - startNorth)) / factor);
            intensity.east  = startEast  + (((time - 12) * (endEast  - startEast))  / factor);
            intensity.south = startSouth + (((time - 12) * (endSouth - startSouth)) / factor);
            intensity.west  = startWest  + (((time - 12) * (endWest  - startWest))  / factor);
        }
        else if (time >= 18 && time < 24 ) {
            startNorth = 0.5;
            endNorth   = 1.0;
            startEast  = 0.0;
            endEast    = 0.5;
            startSouth = 0.5;
            endSouth   = 0.0;
            startWest  = 1.0;
            endWest    = 0.5;

            intensity.north = startNorth + (((time - 18) * (endNorth - startNorth)) / factor);
            intensity.east  = startEast  + (((time - 18) * (endEast  - startEast))  / factor);
            intensity.south = startSouth + (((time - 18) * (endSouth - startSouth)) / factor);
            intensity.west  = startWest  + (((time - 18) * (endWest  - startWest))  / factor);
        }

        return intensity;
    };

    // ------------------------------------------------------------------------------------------------ Public

    pub.init = function () {
        pub.updateColors();

        // Simulate a day
        /**/
        setInterval(function() {
            priv.time = Math.round((priv.time + 0.1) * 100) / 100;
            if (priv.time >= 24) {
                priv.time = 0;
            }
            pub.updateColors();
            //console.log('Time: ', priv.time);
        }, 100);
        /**/
    };

    pub.updateColors = function updateColors() {
        var brightness     = 100,
            solarColor     = { r: 255, g: 255, b: 255 },
            solarIntensity = { north: 0, east: 0, south: 0, west: 0, roof: 0},
            r, g, b;


        // Dynamic light and brightness
        /**/
        brightness     = priv.getBrightness(priv.time);
        solarColor     = priv.getSolarColor(priv.time);
        solarIntensity = priv.getSolarIntensity(priv.time);
        /**/

        console.log(priv.time, '  ' , Math.round((brightness * 100) / 100));

        // Render world color
        r = Math.round((priv.worldColor.r + solarColor.r) / 200 * brightness);
        g = Math.round((priv.worldColor.g + solarColor.g) / 200 * brightness);
        b = Math.round((priv.worldColor.b + solarColor.b) / 200 * brightness);
        priv.shapes.world.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round((priv.cubeColor.north.r + (solarColor.r * solarIntensity.north)) / 200 * brightness);
        g = Math.round((priv.cubeColor.north.g + (solarColor.g * solarIntensity.north)) / 200 * brightness);
        b = Math.round((priv.cubeColor.north.b + (solarColor.b * solarIntensity.north)) / 200 * brightness);
        priv.shapes.north.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render east color
        r = Math.round((priv.cubeColor.east.r + (solarColor.r * solarIntensity.east)) / 200 * brightness);
        g = Math.round((priv.cubeColor.east.g + (solarColor.g * solarIntensity.east)) / 200 * brightness);
        b = Math.round((priv.cubeColor.east.b + (solarColor.b * solarIntensity.east)) / 200 * brightness);
        priv.shapes.east.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render south color
        r = Math.round((priv.cubeColor.south.r + (solarColor.r * solarIntensity.south)) / 200 * brightness);
        g = Math.round((priv.cubeColor.south.g + (solarColor.g * solarIntensity.south)) / 200 * brightness);
        b = Math.round((priv.cubeColor.south.b + (solarColor.b * solarIntensity.south)) / 200 * brightness);
        priv.shapes.south.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render west color
        r = Math.round((priv.cubeColor.west.r + (solarColor.r * solarIntensity.west)) / 200 * brightness);
        g = Math.round((priv.cubeColor.west.g + (solarColor.g * solarIntensity.west)) / 200 * brightness);
        b = Math.round((priv.cubeColor.west.b + (solarColor.b * solarIntensity.west)) / 200 * brightness);
        priv.shapes.west.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render roof color
        r = Math.round((priv.cubeColor.roof.r + solarColor.r * solarIntensity.roof) / 200 * brightness);
        g = Math.round((priv.cubeColor.roof.g + solarColor.g * solarIntensity.roof) / 200 * brightness);
        b = Math.round((priv.cubeColor.roof.b + solarColor.b * solarIntensity.roof) / 200 * brightness);
        priv.shapes.roof.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

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

    var red = {
            north: { r: 255, g: 0, b: 0 },
            east:  { r: 255, g: 0, b: 0 },
            south: { r: 255, g: 0, b: 0 },
            west:  { r: 255, g: 0, b: 0 },
            roof:  { r: 255, g: 0, b: 0 }
        },
        green = {
            north: { r: 0, g: 255, b: 0 },
            east:  { r: 0, g: 255, b: 0 },
            south: { r: 0, g: 255, b: 0 },
            west:  { r: 0, g: 255, b: 0 },
            roof:  { r: 0, g: 255, b: 0 }
        },
        blue = {
            north: { r: 0, g: 0, b: 255 },
            east:  { r: 0, g: 0, b: 255 },
            south: { r: 0, g: 0, b: 255 },
            west:  { r: 0, g: 0, b: 255 },
            roof:  { r: 0, g: 0, b: 255 }
        },
        grey ={
            north: { r: 127, g: 127, b: 127 },
            east:  { r: 127, g: 127, b: 127 },
            south: { r: 127, g: 127, b: 127 },
            west:  { r: 127, g: 127, b: 127 },
            roof:  { r: 127, g: 127, b: 127 }
        },
        solarAltitudeRed   = new SolarAltitude(window, document, jQuery, '#appRed', red),
        solarAltitudeGreen = new SolarAltitude(window, document, jQuery, '#appGreen', green),
        solarAltitudeBlue  = new SolarAltitude(window, document, jQuery, '#appBlue', blue),
        solarAltitudeGrey  = new SolarAltitude(window, document, jQuery, '#appGrey', grey);

    solarAltitudeRed.init();
    solarAltitudeGreen.init();
    solarAltitudeBlue.init();
    solarAltitudeGrey.init();
});
