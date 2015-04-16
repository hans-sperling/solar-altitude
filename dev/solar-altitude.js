function SolarAltitude(win, doc, $, domId, cubeColors) {
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

    priv.cubeColors = cubeColors;

    priv.brightness = {
        min: 25,
        max: 100
    };

    priv.day = 24; // hours per day

    priv.time = 8; // 00:00 - 24:00

    priv.worldColors = {
        list: [
            { r: 255, g: 255, b: 255 }
        ],
        amount: 1
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



    priv.getRgb = function getRgb(color1, color2, time, scale) {
        var timeScale = time % scale,
            result    = {};

        // Checks the start and end color and computes a color between thees dependent on the current time
        if (color1.r >= color2.r) {
            result.r = color1.r - (timeScale * (color1.r - color2.r) / scale);
        }
        else {
            result.r = color1.r + (timeScale * (color2.r - color1.r) / scale);
        }

        if (color1.g >= color2.g) {
            result.g = color1.g - (timeScale * (color1.g - color2.g) / scale);
        }
        else {
            result.g = color1.g + (timeScale * (color2.g - color1.g) / scale);
        }

        if (color1.b >= color2.b) {
            result.b = color1.b - (timeScale * (color1.b - color2.b) / scale);
        }
        else {
            result.b = color1.b + (timeScale * (color2.b - color1.b) / scale);
        }

        return result;
    };



    priv.getColor = function getColor(colors, time) {
        var colorlist   = colors.list,
            colorAmount = colors.amount,
            day         = priv.day,
            scale       = day / colorAmount,
            colorIndex  = Math.floor(time / scale),
            result      = {r: 0, g: 0, b: 0},
            color1, color2;

        if (colorAmount == 1) {
            result = colorlist[0];
        }
        else if (colorAmount > 1) {
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

            result = priv.getRgb(color1, color2, time, scale);
        }

        return result;
    };



    priv.getWorldColor = function getWorldColor(time) {
        return priv.getColor(priv.worldColors, time)
    };



    priv.getCubeColor = function getCubeColor(time) {
        var colorlist   = priv.cubeColors.list,
            colorAmount = priv.cubeColors.amount,
            day         = priv.day,
            scale       = day / colorAmount,
            colorIndex  = Math.floor(time / scale),
            result      = {r: 0, g: 0, b: 0},
            color1, color2, i, shapeAmount;

        if (colorAmount > 1) {
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


            shapeAmount = Math.min(color1.length, color2.length);
            for (i = 0; i < shapeAmount; i++) {
                result[i] = priv.getRgb(color1[i], color2[i], time, scale);
            }
        }
        else {
            result = colorlist[0];
        }
        return result;
    };




    /**
     * Returns solar color at the given time
     */
    priv.getSolarColor = function getSolarColor(time) {
        return priv.getColor(priv.solarColors, time);
    };



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
            time           = priv.time,
            solarColor     = { r: 255, g: 255, b: 255 },
            solarIntensity = { north: 0, east: 0, south: 0, west: 0, roof: 0},
            worldColor     = { r: 255, g: 255, b: 255},
            cubeColor      = {
                north: { r: 127, g: 127, b: 127 },
                east:  { r: 127, g: 127, b: 127 },
                south: { r: 127, g: 127, b: 127 },
                west:  { r: 127, g: 127, b: 127 },
                roof:  { r: 127, g: 127, b: 127 }
            },
            r, g, b;

        // Dynamic light and brightness
        /**/
        //brightness     = priv.getBrightness(time);
        solarColor     = priv.getSolarColor(time);
        solarIntensity = priv.getSolarIntensity(time);
        worldColor     = priv.getWorldColor(time);
        cubeColor      = priv.getCubeColor(time);
        /**/

        // Render world color
        r = Math.round(((worldColor.r + solarColor.r) / (2*100)) * brightness);
        g = Math.round(((worldColor.g + solarColor.g) / (2*100)) * brightness);
        b = Math.round(((worldColor.b + solarColor.b) / (2*100)) * brightness);
        priv.shapes.world.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round(((cubeColor[0].r + (solarColor.r * solarIntensity[0])) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor[0].g + (solarColor.g * solarIntensity[0])) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor[0].b + (solarColor.b * solarIntensity[0])) / (2 * 100)) * brightness);
        priv.shapes.north.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render east color
        r = Math.round(((cubeColor[1].r + (solarColor.r * solarIntensity[1])) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor[1].g + (solarColor.g * solarIntensity[1])) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor[1].b + (solarColor.b * solarIntensity[1])) / (2 * 100)) * brightness);
        priv.shapes.east.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render south color
        r = Math.round(((cubeColor[2].r + (solarColor.r * solarIntensity[2])) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor[2].g + (solarColor.g * solarIntensity[2])) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor[2].b + (solarColor.b * solarIntensity[2])) / (2 * 100)) * brightness);
        priv.shapes.south.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render west color
        r = Math.round(((cubeColor[3].r + (solarColor.r * solarIntensity[3])) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor[3].g + (solarColor.g * solarIntensity[3])) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor[3].b + (solarColor.b * solarIntensity[3])) / (2 * 100)) * brightness);
        priv.shapes.west.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render roof color
        r = Math.round(((cubeColor[4].r + solarColor.r * solarIntensity[4]) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor[4].g + solarColor.g * solarIntensity[4]) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor[4].b + solarColor.b * solarIntensity[4]) / (2 * 100)) * brightness);
        priv.shapes.roof.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');
    };

    // ------------------------------------------------------------------------------------------------ Return

    return pub;

}

// ----------------------------------------------------------------------------------------------------- Run application

jQuery(document).ready(function() {
    'use strict';

    var red = {
            list: [[
                {r: 255, g: 0, b: 0},
                {r: 255, g: 0, b: 0},
                {r: 255, g: 0, b: 0},
                {r: 255, g: 0, b: 0},
                {r: 255, g: 0, b: 0}
            ]],
            amount: 1
        },
        green = {
            list: [[
                {r: 0, g: 255, b: 0},
                {r: 0, g: 255, b: 0},
                {r: 0, g: 255, b: 0},
                {r: 0, g: 255, b: 0},
                {r: 0, g: 255, b: 0}
            ]],
            amount: 1
        },
        blue = {
            list: [[
                {r: 0, g: 0, b: 255},
                {r: 0, g: 0, b: 255},
                {r: 0, g: 0, b: 255},
                {r: 0, g: 0, b: 255},
                {r: 0, g: 0, b: 255}
            ]],
            amount: 1
        },
        grey = {
            list: [[
                {r: 255, g: 0, b: 0},
                {r: 255, g: 0, b: 0},
                {r: 255, g: 0, b: 0},
                {r: 255, g: 0, b: 0},
                {r: 255, g: 0, b: 0}
            ], [
                {r: 0, g: 255, b: 0},
                {r: 0, g: 255, b: 0},
                {r: 0, g: 255, b: 0},
                {r: 0, g: 255, b: 0},
                {r: 0, g: 255, b: 0}
            ], [
                {r: 0, g: 0, b: 255},
                {r: 0, g: 0, b: 255},
                {r: 0, g: 0, b: 255},
                {r: 0, g: 0, b: 255},
                {r: 0, g: 0, b: 255}
            ]],
            amount: 2
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
