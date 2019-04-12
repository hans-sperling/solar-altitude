function SolarAltitude(win, doc, $, domId) {
    let priv = {};
    let pub = {};

    // ----------------------------------------------------------------------------------------------- Private

    priv.animate     = false;
    priv.degubOutput = true;
    priv.shapes = {
        world : $(domId),
        north : $(domId + ' .north'),
        east  : $(domId + ' .east'),
        south : $(domId + ' .south'),
        west  : $(domId + ' .west'),
        front : $(domId + ' .front')
    };

    priv.cubeColor = {
        north : {r: 127, g: 127, b: 127},
        east  : {r: 127, g: 127, b: 127},
        south : {r: 127, g: 127, b: 127},
        west  : {r: 127, g: 127, b: 127},
        front : {r: 127, g: 127, b: 127},
        back  : {r: 127, g: 127, b: 127}
    };

    priv.brightness = {
        min: 25,
        max: 100
    };

    priv.day = 24; // hours per day

    priv.time = 8; // 00:00 - 24:00

    priv.worldColorList = [
        { r: 255, g: 255, b: 255 }
    ];

    priv.solarColorList = [
        { r: 0,   g: 0,   b: 255 }, // 00:00 - Midnight color
        { r: 255, g: 0,   b: 0   }, // 06:00 - Sunrise color
        { r: 255, g: 255, b: 0   }, // 12:00 - Midday color
        { r: 255, g: 0,   b: 0   }  // 18:00 - Sunset color
    ];

    priv.solarIntensityList = [
        // [ north, east, south, west, front]
        [0.8, 0.5, 0.2, 0.5, 1.0], // 00:00 - Solar light shines from the north
        [0.5, 0.8, 0.5, 0.2, 1.0], // 06:00 - Solar light shines from the east
        [0.2, 0.5, 0.8, 0.5, 1.0], // 12:00 - Solar light shines from the south
        [0.5, 0.2, 0.5, 0.8, 1.0]  // 18:00 - Solar light shines from the west
    ];


    // -----------------------------------------------------------------------------------------------------------------

    priv.overwriteConfig = function overwriteConfig(config) {
        priv.cubeColor = config.cubeColor;
    };


    /**
     * Checks if the type of the given parameter is an array.
     *
     * @param  {*} value
     * @return {boolean}
     */
    priv.isArray = function isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };


    /**
     * Checks if the type of the given parameter is an object.
     *
     * @param  {*} value
     * @return {boolean}
     */
    priv.isObject = function isObject(value) {
        return Object.prototype.toString.call(value) === "[object Object]";
    };


    priv.getRelativeNumber = function getRelativeNumber(start, end, time, scale) {
        let timeScale = (time % scale);

        if (start >= end) {
            return (start - (timeScale * (start - end) / scale));
        }
        else {
            return (start + (timeScale * (end - start) / scale));
        }
    };


    priv.getRgbColor = function getRgbColor(rgbStart, rgbEnd, time, scale) {
        return {
            r: priv.getRelativeNumber(rgbStart.r, rgbEnd.r, time, scale),
            g: priv.getRelativeNumber(rgbStart.g, rgbEnd.g, time, scale),
            b: priv.getRelativeNumber(rgbStart.b, rgbEnd.b, time, scale)
        };
    };


    priv.getListEntries = function getListEntries(currentList, time) {
        let list   = currentList;
        let counter = currentList.length;
        let day    = priv.day;
        let scale  = day / counter;
        let index  = Math.floor(time / scale);
        let result = [];

        if (counter === 1) {
            result[0] = list[0];
            result[1] = list[0];
        }
        else {
            if (index < counter) {
                result[0] = list[index];
            }
            else {
                result[0] = list[0];
            }

            if ((index + 1) < counter) {
                result[1] = list[(index + 1)];
            }
            else {
                result[1] = list[0];
            }
        }

        return result;
    };


    priv.getRgbColorFromColor = function getRgbColorFromColor(color, time) {
        let colorList;

        if (priv.isObject(color)) {
            colorList = [color];
        }
        else {
            colorList = color;
        }

        let colorCounter = colorList.length || 1;
        let colors       = priv.getListEntries(colorList, time);
        let scale        = (priv.day / colorCounter);

        return priv.getRgbColor(colors[0], colors[1], time, scale);
    };


    // ------------------------------------------------------------------------------------------------ Public

    pub.init = function (config) {
        priv.overwriteConfig(config);

        if (priv.animate) {
            // Simulate a day
            setInterval(function() {
                priv.time = Math.round((priv.time + 0.1) * 100) / 100;
                if (priv.time >= priv.day) {
                    priv.time = 0;
                }
                pub.updateColors();
                if (priv.degubOutput) {
                    console.log('Time: ', priv.time);
                }
            }, 100);
        } else {
            console.log('Time: ', priv.time);
            pub.updateColors();
        }
    };


    /**
     * Returns brightness as percentage of the day between min and max.
     */
    pub.getBrightness = function getBrightness(time) {
        let min = priv.brightness.min;
        let max = priv.brightness.max;
        let day = priv.day;

        return ((((min - max) * Math.cos((Math.PI * time) * 2 / day)) + max + min) / 2);
    };


    pub.getSolarColor = function getSolarColor(time) {
        return priv.getRgbColorFromColor(priv.solarColorList, time);
    };


    pub.getMapColor = function getMapColor(time) {
        return priv.getRgbColorFromColor(priv.worldColorList, time);
    };


    pub.getCubeColor = function getCubeColor(time) {
        return {
            north: priv.getRgbColorFromColor([priv.cubeColor.north], time),
            east:  priv.getRgbColorFromColor([priv.cubeColor.east],  time),
            south: priv.getRgbColorFromColor([priv.cubeColor.south], time),
            west:  priv.getRgbColorFromColor([priv.cubeColor.west],  time),
            front: priv.getRgbColorFromColor([priv.cubeColor.front], time)
        };
    };


    pub.getSolarIntensity = function getSolarIntensity(time) {
        let list      = priv.solarIntensityList;
        let counter   = list.length;
        let intensity = priv.getListEntries(priv.solarIntensityList, time);
        let day       = priv.day;
        let scale     = day / counter;
        let result    = [];
        let i;
        let shapeAmount;

        shapeAmount = Math.min(intensity[0].length, intensity[1].length);

        for (i = 0; i < shapeAmount; i += 1) {
            result[i] = priv.getRelativeNumber(intensity[0][i], intensity[1][i], time, scale);
        }

        return result;
    };



    pub.updateColors = function updateColors() {
        // Dynamic light and brightness
        let r;
        let g;
        let b;
        let brightness     = pub.getBrightness(priv.time);
        let solarColor     = pub.getSolarColor(priv.time);
        let solarIntensity = pub.getSolarIntensity(priv.time);
        let worldColor     = pub.getMapColor(priv.time);
        let cubeColor      = pub.getCubeColor(priv.time);

        // Render world color
        r = Math.round(((worldColor.r + solarColor.r) / (2*100)) * brightness);
        g = Math.round(((worldColor.g + solarColor.g) / (2*100)) * brightness);
        b = Math.round(((worldColor.b + solarColor.b) / (2*100)) * brightness);
        priv.shapes.world.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render north color
        r = Math.round(((cubeColor.north.r + (solarColor.r * solarIntensity[0])) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor.north.g + (solarColor.g * solarIntensity[0])) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor.north.b + (solarColor.b * solarIntensity[0])) / (2 * 100)) * brightness);
        priv.shapes.north.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render east color
        r = Math.round(((cubeColor.east.r + (solarColor.r * solarIntensity[1])) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor.east.g + (solarColor.g * solarIntensity[1])) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor.east.b + (solarColor.b * solarIntensity[1])) / (2 * 100)) * brightness);
        priv.shapes.east.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render south color
        r = Math.round(((cubeColor.south.r + (solarColor.r * solarIntensity[2])) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor.south.g + (solarColor.g * solarIntensity[2])) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor.south.b + (solarColor.b * solarIntensity[2])) / (2 * 100)) * brightness);
        priv.shapes.south.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render west color
        r = Math.round(((cubeColor.west.r + (solarColor.r * solarIntensity[3])) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor.west.g + (solarColor.g * solarIntensity[3])) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor.west.b + (solarColor.b * solarIntensity[3])) / (2 * 100)) * brightness);
        priv.shapes.west.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');

        // Render front color
        r = Math.round(((cubeColor.front.r + solarColor.r * solarIntensity[4]) / (2 * 100)) * brightness);
        g = Math.round(((cubeColor.front.g + solarColor.g * solarIntensity[4]) / (2 * 100)) * brightness);
        b = Math.round(((cubeColor.front.b + solarColor.b * solarIntensity[4]) / (2 * 100)) * brightness);
        priv.shapes.front.css('background', 'rgb(' + r + ',' + g + ',' + b + ')');
    };

    // ------------------------------------------------------------------------------------------------ Return

    return pub;

}

// ----------------------------------------------------------------------------------------------------- Run application

jQuery(document).ready(function() {
    'use strict';

    let redCube = {
        north : {r: 255, g: 0, b: 0},
        east  : {r: 255, g: 0, b: 0},
        south : {r: 255, g: 0, b: 0},
        west  : {r: 255, g: 0, b: 0},
        front : {r: 255, g: 0, b: 0},
        back  : {r: 255, g: 0, b: 0}
    };
    let greenCube = {
        north : {r: 0, g: 255, b: 0},
        east  : {r: 0, g: 255, b: 0},
        south : {r: 0, g: 255, b: 0},
        west  : {r: 0, g: 255, b: 0},
        front : {r: 0, g: 255, b: 0},
        back  : {r: 0, g: 255, b: 0}
    };
    let blueCube = {
        north : {r: 0, g: 0, b: 255},
        east  : {r: 0, g: 0, b: 255},
        south : {r: 0, g: 0, b: 255},
        west  : {r: 0, g: 0, b: 255},
        front : {r: 0, g: 0, b: 255},
        back  : {r: 0, g: 0, b: 255}
    };
    let whiteCube = {
        north : {r: 255, g: 255, b: 255},
        east  : {r: 255, g: 255, b: 255},
        south : {r: 255, g: 255, b: 255},
        west  : {r: 255, g: 255, b: 255},
        front : {r: 255, g: 255, b: 255},
        back  : {r: 255, g: 255, b: 255}
    };
    let greyCube = {
        north : {r: 127, g: 127, b: 127},
        east  : {r: 127, g: 127, b: 127},
        south : {r: 127, g: 127, b: 127},
        west  : {r: 127, g: 127, b: 127},
        front : {r: 127, g: 127, b: 127},
        back  : {r: 127, g: 127, b: 127}
    };
    let blackCube = {
        north : {r: 0, g: 0, b: 0},
        east  : {r: 0, g: 0, b: 0},
        south : {r: 0, g: 0, b: 0},
        west  : {r: 0, g: 0, b: 0},
        front : {r: 0, g: 0, b: 0},
        back  : {r: 0, g: 0, b: 0}
    };
    let solarAltitudeRed   = new SolarAltitude(window, document, jQuery, '#appRed',   redCube);
    let solarAltitudeGreen = new SolarAltitude(window, document, jQuery, '#appGreen', greenCube);
    let solarAltitudeBlue  = new SolarAltitude(window, document, jQuery, '#appBlue',  blueCube);
    let solarAltitudeWhite = new SolarAltitude(window, document, jQuery, '#appWhite', whiteCube);
    let solarAltitudeGrey  = new SolarAltitude(window, document, jQuery, '#appGrey',  greyCube);
    let solarAltitudeBlack = new SolarAltitude(window, document, jQuery, '#appBlack', blackCube);

    solarAltitudeRed.init({cubeColor : redCube});
    solarAltitudeGreen.init({cubeColor : greenCube});
    solarAltitudeBlue.init({cubeColor : blueCube});
    solarAltitudeWhite.init({cubeColor : whiteCube});
    solarAltitudeGrey.init({cubeColor : greyCube});
    solarAltitudeBlack.init({cubeColor : blackCube});
});
