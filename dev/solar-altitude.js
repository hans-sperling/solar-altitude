function SolarAltitude(win, doc, $, domId, cubeColors) {
    var priv = {}, pub = {};

    // ----------------------------------------------------------------------------------------------- Private

    priv.animate = !true;
    priv.shapes = {
        world : $(domId),
        north : $(domId + ' .north'),
        east  : $(domId + ' .east'),
        south : $(domId + ' .south'),
        west  : $(domId + ' .west'),
        front : $(domId + ' .front')
    };

    priv.cubeColors = cubeColors;

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


    
    priv.getRelativeNumber = function getRelativeNumber(start, end, time, scale) {
        var timeScale = (time % scale);
            
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
        }
    };



    priv.getListEntries = function getListEntries(currentList, time) {
        var list   = currentList,
            counter = currentList.length,
            day    = priv.day,
            scale  = day / counter,
            index  = Math.floor(time / scale),
            result = [];

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




    priv.getColorFromList = function getColorFromList(colorList, time) {
        var colorCounter = colorList.length,
            colors       = priv.getListEntries(colorList, time),
            day          = priv.day,
            scale        = day / colorCounter,
            colorIndex   = Math.floor(time / scale),
            result       = {r: 0, g: 0, b: 0};

        return priv.getRgbColor(colors[0], colors[1], time, scale);
    };




    priv.getColorFromObj = function getColorFromObj(colorObj, time) {
        var colorInput   = [colorObj],
            colorCounter = colorInput.length,
            colors       = priv.getListEntries(colorInput, time),


            day         = priv.day,
            scale       = day / colorCounter,
            colorIndex  = Math.floor(time / scale),
            result      = {r: 0, g: 0, b: 0};



        return priv.getRgbColor(colors[0], colors[1], time, scale);
    };



    // ------------------------------------------------------------------------------------------------ Public



    pub.init = function () {
        if (priv.animate) {
            // Simulate a day
            setInterval(function() {
                priv.time = Math.round((priv.time + 0.1) * 100) / 100;
                if (priv.time >= priv.day) {
                    priv.time = 0;
                }
                pub.updateColors();
                console.log('Time: ', priv.time);
            }, 100);
        } else {
            pub.updateColors();
        }
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
        return priv.getColorFromList(priv.solarColorList, time);
    };



    pub.getMapColor = function getMapColor(time) {
        return priv.getColorFromList(priv.worldColorList, time)
    };



    pub.getCubeColor = function getCubeColor(time, rgbColor) {

        var colorAmount = priv.cubeColors.amount,
            resultColor      = priv.getColorFromObj(rgbColor, time),
            day         = priv.day,
            scale       = day / colorAmount,
            colorIndex  = Math.floor(time / scale),
            result      = [],
            i, shapeAmount;


        return resultColor;
    };



    pub.getSolarIntensity = function getSolarIntensity(time) {
        var list      = priv.solarIntensityList,
            counter   = list.length,
            intensity = priv.getListEntries(priv.solarIntensityList, time),
            day       = priv.day,
            scale     = day / counter,
            result    = [],
            i, shapeAmount;

        shapeAmount = Math.min(intensity[0].length, intensity[1].length);
        for (i = 0; i < shapeAmount; i++) {
            result[i] = priv.getRelativeNumber(intensity[0][i], intensity[1][i], time, scale);
        }

        return result;
    };



    pub.updateColors = function updateColors() {
        // Dynamic light and brightness
        /**/
        var r, g, b,
            time = priv.time,
            brightness     = pub.getBrightness(time),
            solarColor     = pub.getSolarColor(time),
            solarIntensity = pub.getSolarIntensity(time),
            worldColor     = pub.getMapColor(time),
            cubeColor = {
                north: pub.getCubeColor(time, priv.cubeColors.north),
                east:  pub.getCubeColor(time, priv.cubeColors.east),
                south: pub.getCubeColor(time, priv.cubeColors.south),
                west:  pub.getCubeColor(time, priv.cubeColors.west),
                front: pub.getCubeColor(time, priv.cubeColors.front)
            };

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

    var red = {
            north : {r: 255, g: 0, b: 0},
            east  : {r: 255, g: 0, b: 0},
            south : {r: 255, g: 0, b: 0},
            west  : {r: 255, g: 0, b: 0},
            front : {r: 255, g: 0, b: 0},
            back  : {r: 255, g: 0, b: 0}
        },
        green = {
            north : {r: 0, g: 255, b: 0},
            east  : {r: 0, g: 255, b: 0},
            south : {r: 0, g: 255, b: 0},
            west  : {r: 0, g: 255, b: 0},
            front : {r: 0, g: 255, b: 0},
            back  : {r: 0, g: 255, b: 0}
        },
        blue = {
            north : {r: 0, g: 0, b: 255},
            east  : {r: 0, g: 0, b: 255},
            south : {r: 0, g: 0, b: 255},
            west  : {r: 0, g: 0, b: 255},
            front : {r: 0, g: 0, b: 255},
            back  : {r: 0, g: 0, b: 255}
        },
        grey = {
            north : {r: 127, g: 127, b: 127},
            east  : {r: 127, g: 127, b: 127},
            south : {r: 127, g: 127, b: 127},
            west  : {r: 127, g: 127, b: 127},
            front : {r: 127, g: 127, b: 127},
            back  : {r: 127, g: 127, b: 127}
        };
        /*,
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
        },*/

        var solarAltitudeRed   = new SolarAltitude(window, document, jQuery, '#appRed', red),
            solarAltitudeGreen = new SolarAltitude(window, document, jQuery, '#appGreen', green),
            solarAltitudeBlue  = new SolarAltitude(window, document, jQuery, '#appBlue', blue),
            solarAltitudeGrey  = new SolarAltitude(window, document, jQuery, '#appGrey', grey);
            // solarAltitudeGrey  = new SolarAltitude(window, document, jQuery, '#appGrey', grey);

    solarAltitudeRed.init();
    solarAltitudeGreen.init();
    solarAltitudeBlue.init();
    solarAltitudeGrey.init();
    // solarAltitudeGrey.init();
});
