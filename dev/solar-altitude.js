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

    priv.cubeColor = cubeColor;

    priv.brightness = {
        min: 25,
        max: 100
    };

    priv.day = 24; // hours per day

    priv.time = 8; // 00:00 - 24:00

    priv.worldColor = {
        r: 255,
        g: 255,
        b: 255
    };

    priv.solarColors = {
        list: [
            { r: 0,   g: 0,   b: 255 }, // 00:00 - Midnight color
            { r: 255, g: 0,   b: 0   }, // 06:00 - Sunrise color
            { r: 255, g: 255, b: 0   }, // 12:00 - Midday color
            { r: 255, g: 0,   b: 0   }  // 18:00 - Sunset color
        ],
        amount: 4
    };

    priv.solarIntensity = {
        list: [
            // [ north, east, south, west, roof]
            [0.8, 0.5, 0.2, 0.5, 1.0], // 00:00 - Solar light shines from the north
            [0.5, 0.8, 0.5, 0.2, 1.0], // 06:00 - Solar light shines from the east
            [0.2, 0.5, 0.8, 0.5, 1.0], // 12:00 - Solar light shines from the south
            [0.5, 0.2, 0.5, 0.8, 1.0]  // 18:00 - Solar light shines from the west
        ],
        amount: 4
    };



    // -----------------------------------------------------------------------------------------------------------------



    /**
     * Returns brightness as percentage of the day between min and max.
     */
    priv.getBrightness = function getBrightness(time) {
        var min = priv.brightness.min,
            max = priv.brightness.max,
            day = priv.day;

        return ((((min - max) * Math.cos(((Math.PI * time) * 2 / day))) + max + min) / 2);
    };



    /**
     * Returns solar color at the given time
     */
    priv.getSolarColor = function getSolarColor(time) {
        var colorlist   = priv.solarColors.list,
            colorAmount = priv.solarColors.amount,
            day         = priv.day,
            scale       = day / colorAmount,
            colorIndex  = Math.floor(time / scale),
            result      = {r: 0, g: 0, b: 0},
            color1, color2;

        // Gets start and end color of the current day section
        // todo: Check for real amount of colors. If there is only one color the following does not make sense.
        if (colorIndex < colorAmount) {
            color1 = colorlist[colorIndex];
        }
        else {
            color1 = colorlist[0];
        }

        if ((colorIndex + 1) < colorAmount) {
            color2 = colorlist[(colorIndex + 1)];
        }
        else {
            color2 = colorlist[0];
        }


        // Checks the start and end color and computes a color between thees dependent on the current time
        if (color1.r >= color2.r) {
            result.r = color1.r - ((time % scale) * (color1.r - color2.r) / scale);
        }
        else {
            result.r = color1.r + ((time % scale) * (color2.r - color1.r) / scale);
        }

        if (color1.g >= color2.g) {
            result.g = color1.g - ((time % scale) * (color1.g - color2.g) / scale);
        }
        else {
            result.g = color1.g + ((time % scale) * (color2.g - color1.g) / scale);
        }

        if (color1.b >= color2.b) {
            result.b = color1.b - ((time % scale) * (color1.b - color2.b) / scale);
        }
        else {
            result.b = color1.b + ((time % scale) * (color2.b - color1.b) / scale);
        }

        return result;
    };



    // -----------------------------------------------------------------------------------------------------------------



    priv.getSolarIntensity = function getSolarIntensity(time) {
        var intensityList   = priv.solarIntensity.list,
            intensityAmount = priv.solarIntensity.amount,
            day             = priv.day,
            scale           = day / intensityAmount,
            intensityIndex  = Math.floor(time / scale),
            result          = [],
            intensity1, intensity2, i, shapeAmount;

        if (intensityIndex < intensityAmount) {
            intensity1 = intensityList[intensityIndex];
        }
        else {
            intensity1 = intensityList[0];
        }

        if ((intensityIndex + 1) < intensityAmount) {
            intensity2 = intensityList[(intensityIndex + 1)];
        }
        else {
            intensity2 = intensityList[0];
        }


        shapeAmount = Math.min(intensity1.length, intensity2.length);
        for (i = 0; i < shapeAmount; i++) {
            if (intensity1[i] >= intensity2[i]) {
                result[i] = intensity1[i] - ((time % scale) * (intensity1[i] - intensity2[i]) / scale);
            }
            else {
                result[i] = intensity1[i] + ((time % scale) * (intensity2[i] - intensity1[i]) / scale);
            }
        }

        return result;
    };



    // ------------------------------------------------------------------------------------------------ Public



    pub.init = function () {
        pub.updateColors();

        // Simulate a day
        /** /
        setInterval(function() {
            priv.time = Math.round((priv.time + 0.1) * 100) / 100;
            if (priv.time >= priv.day) {
                priv.time = 0;
            }
            pub.updateColors();
            console.log('Time: ', priv.time);
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

        // Render world color
        r = Math.round(((priv.worldColor.r + solarColor.r) / (2*100)) * brightness);
        g = Math.round(((priv.worldColor.g + solarColor.g) / (2*100)) * brightness);
        b = Math.round(((priv.worldColor.b + solarColor.b) / (2*100)) * brightness);
        priv.shapes.world.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round(((priv.cubeColor.north.r + (solarColor.r * solarIntensity[0])) / (2 * 100)) * brightness);
        g = Math.round(((priv.cubeColor.north.g + (solarColor.g * solarIntensity[0])) / (2 * 100)) * brightness);
        b = Math.round(((priv.cubeColor.north.b + (solarColor.b * solarIntensity[0])) / (2 * 100)) * brightness);
        priv.shapes.north.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render east color
        r = Math.round(((priv.cubeColor.east.r + (solarColor.r * solarIntensity[1])) / (2 * 100)) * brightness);
        g = Math.round(((priv.cubeColor.east.g + (solarColor.g * solarIntensity[1])) / (2 * 100)) * brightness);
        b = Math.round(((priv.cubeColor.east.b + (solarColor.b * solarIntensity[1])) / (2 * 100)) * brightness);
        priv.shapes.east.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render south color
        r = Math.round(((priv.cubeColor.south.r + (solarColor.r * solarIntensity[2])) / (2 * 100)) * brightness);
        g = Math.round(((priv.cubeColor.south.g + (solarColor.g * solarIntensity[2])) / (2 * 100)) * brightness);
        b = Math.round(((priv.cubeColor.south.b + (solarColor.b * solarIntensity[2])) / (2 * 100)) * brightness);
        priv.shapes.south.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render west color
        r = Math.round(((priv.cubeColor.west.r + (solarColor.r * solarIntensity[3])) / (2 * 100)) * brightness);
        g = Math.round(((priv.cubeColor.west.g + (solarColor.g * solarIntensity[3])) / (2 * 100)) * brightness);
        b = Math.round(((priv.cubeColor.west.b + (solarColor.b * solarIntensity[3])) / (2 * 100)) * brightness);
        priv.shapes.west.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render roof color
        r = Math.round(((priv.cubeColor.roof.r + solarColor.r * solarIntensity[4]) / (2 * 100)) * brightness);
        g = Math.round(((priv.cubeColor.roof.g + solarColor.g * solarIntensity[4]) / (2 * 100)) * brightness);
        b = Math.round(((priv.cubeColor.roof.b + solarColor.b * solarIntensity[4]) / (2 * 100)) * brightness);
        priv.shapes.roof.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');
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
