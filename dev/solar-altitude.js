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


    
    priv.getRelativeNumber = function getRelativeNumber(start, end, time, scale) {
        var timeScale = (time % scale);
            
        if (start >= end) {
            return (start - (timeScale * (start - end) / scale));
        }
        else {
            return (start + (timeScale * (end - start) / scale));
        }
    };

    
    
    priv.getRgb = function getRgb(color1, color2, time, scale) {        
        return {
            r: priv.getRelativeNumber(color1.r, color2.r, time, scale),
            g: priv.getRelativeNumber(color1.g, color2.g, time, scale),
            b: priv.getRelativeNumber(color1.b, color2.b, time, scale)
        }
    };



    priv.getColor = function getColor(colorList, time) {
        var colorAmount = colorList.amount,
            colors      = priv.getListEntries(colorList, time),
            day         = priv.day,
            scale       = day / colorAmount,
            colorIndex  = Math.floor(time / scale),
            result      = {r: 0, g: 0, b: 0};

        return priv.getRgb(colors[0], colors[1], time, scale);
    };



    priv.getListEntries = function getListEntries(currentList, time) {
        var list   = currentList.list,
            amount = currentList.amount,
            day    = priv.day,
            scale  = day / amount,
            index  = Math.floor(time / scale),
            result = [];

        if (amount == 1) {
            result[0] = list[0];
            result[1] = list[0];
        }
        else {
            if (index < amount) {
                result[0] = list[index];
            }
            else {
                result[0] = list[0];
            }

            if ((index + 1) < amount) {
                result[1] = list[(index + 1)];
            }
            else {
                result[1] = list[0];
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



    /**
     * Returns brightness as percentage of the day between min and max.
     */
    pub.getBrightness = function getBrightness(time) {
        var min = priv.brightness.min,
            max = priv.brightness.max,
            day = priv.day;

        return ((((min - max) * Math.cos(((Math.PI * time) * 2 / day))) + max + min) / 2);
    };



    pub.getSolarColor = function getSolarColor(time) {
        return priv.getColor(priv.solarColors, time);
    };



    pub.getMapColor = function getMapColor(time) {
        return priv.getColor(priv.worldColors, time)
    };



    pub.getCubeColor = function getCubeColor(time) {
        var colorAmount = priv.cubeColors.amount,
            colors      = priv.getListEntries(priv.cubeColors, time),
            day         = priv.day,
            scale       = day / colorAmount,
            colorIndex  = Math.floor(time / scale),
            result      = [],
            i, shapeAmount;

        shapeAmount = Math.min(colors[0].length, colors[1].length);
        for (i = 0; i < shapeAmount; i++) {
            result[i] = priv.getRgb(colors[0][i], colors[1][i], time, scale);
        }

        return result;
    };



    pub.getSolarIntensity = function getSolarIntensity(time) {
        var list      = priv.solarIntensity.list,
            amount    = priv.solarIntensity.amount,
            intensity = priv.getListEntries(priv.solarIntensity, time),
            day       = priv.day,
            scale     = day / amount,
            result    = [],
            i, shapeAmount;

        shapeAmount = Math.min(intensity[0].length, intensity[1].length);
        for (i = 0; i < shapeAmount; i++) {
            result[i] = priv.getRelativeNumber(intensity[0][i], intensity[1][i], time, scale);
        }

        return result;
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
        brightness     = pub.getBrightness(time);
        solarColor     = pub.getSolarColor(time);
        solarIntensity = pub.getSolarIntensity(time);
        worldColor     = pub.getMapColor(time);
        cubeColor      = pub.getCubeColor(time);
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
