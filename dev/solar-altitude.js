function SolarAltitude(win, doc, $, domId) {
    let priv = {};
    let pub  = {};

    // ----------------------------------------------------------------------------------------------------------------------- Configuration

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


    // ----------------------------------------------------------------------------------------------------------------------------- Private

    priv.overwriteConfig = function overwriteConfig(config) {
        priv.day                = config.day;
        priv.time               = config.time;
        priv.brightness         = config.brightness;
        priv.cubeColor          = config.cubeColor;
        priv.solarColorList     = config.solarColorList;
        priv.solarIntensityList = config.solarIntensityList;
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


    /**
     * Returns brightness as percentage of the day between min and max.
     */
    priv.getBrightness = function getBrightness(time) {
        let min = priv.brightness.min;
        let max = priv.brightness.max;
        let day = priv.day;

        return ((((min - max) * Math.cos((Math.PI * time) * 2 / day)) + max + min) / 2);
    };


    priv.getSolarColor = function getSolarColor(time) {
        return priv.getRgbColorFromColor(priv.solarColorList, time);
    };


    priv.getMapColor = function getMapColor(time) {
        return priv.getRgbColorFromColor(priv.worldColorList, time);
    };


    priv.getCubeColor = function getCubeColor(time) {
        return {
            north: priv.getRgbColorFromColor([priv.cubeColor.north], time),
            east:  priv.getRgbColorFromColor([priv.cubeColor.east],  time),
            south: priv.getRgbColorFromColor([priv.cubeColor.south], time),
            west:  priv.getRgbColorFromColor([priv.cubeColor.west],  time),
            front: priv.getRgbColorFromColor([priv.cubeColor.front], time)
        };
    };


    priv.getSolarIntensity = function getSolarIntensity(time) {
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



    priv.getUpdatedColors = function getUpdatedColors(time) {
        const defaultColor = 0;

        // Dynamic light and brightness
        let brightness     = priv.getBrightness(time);
        let solarColor     = priv.getSolarColor(time);
        let solarIntensity = priv.getSolarIntensity(time);
        let worldColor     = priv.getMapColor(time);
        let cubeColor      = priv.getCubeColor(time);
        let color = {
            world : {r: defaultColor, g: defaultColor, b: defaultColor},
            north : {r: defaultColor, g: defaultColor, b: defaultColor},
            east  : {r: defaultColor, g: defaultColor, b: defaultColor},
            south : {r: defaultColor, g: defaultColor, b: defaultColor},
            west  : {r: defaultColor, g: defaultColor, b: defaultColor},
            front : {r: defaultColor, g: defaultColor, b: defaultColor}
        };

        // Render world color
        color.world.r = Math.round(((worldColor.r + solarColor.r) / (2*100)) * brightness);
        color.world.g = Math.round(((worldColor.g + solarColor.g) / (2*100)) * brightness);
        color.world.b = Math.round(((worldColor.b + solarColor.b) / (2*100)) * brightness);


        // Render north color
        color.north.r = Math.round(((cubeColor.north.r + (solarColor.r * solarIntensity[0])) / (2 * 100)) * brightness);
        color.north.g = Math.round(((cubeColor.north.g + (solarColor.g * solarIntensity[0])) / (2 * 100)) * brightness);
        color.north.b = Math.round(((cubeColor.north.b + (solarColor.b * solarIntensity[0])) / (2 * 100)) * brightness);

        // Render east color
        color.east.r = Math.round(((cubeColor.east.r + (solarColor.r * solarIntensity[1])) / (2 * 100)) * brightness);
        color.east.g = Math.round(((cubeColor.east.g + (solarColor.g * solarIntensity[1])) / (2 * 100)) * brightness);
        color.east.b = Math.round(((cubeColor.east.b + (solarColor.b * solarIntensity[1])) / (2 * 100)) * brightness);

        // Render south color
        color.south.r = Math.round(((cubeColor.south.r + (solarColor.r * solarIntensity[2])) / (2 * 100)) * brightness);
        color.south.g = Math.round(((cubeColor.south.g + (solarColor.g * solarIntensity[2])) / (2 * 100)) * brightness);
        color.south.b = Math.round(((cubeColor.south.b + (solarColor.b * solarIntensity[2])) / (2 * 100)) * brightness);

        // Render west color
        color.west.r = Math.round(((cubeColor.west.r + (solarColor.r * solarIntensity[3])) / (2 * 100)) * brightness);
        color.west.g = Math.round(((cubeColor.west.g + (solarColor.g * solarIntensity[3])) / (2 * 100)) * brightness);
        color.west.b = Math.round(((cubeColor.west.b + (solarColor.b * solarIntensity[3])) / (2 * 100)) * brightness);

        // Render front color
        color.front.r = Math.round(((cubeColor.front.r + solarColor.r * solarIntensity[4]) / (2 * 100)) * brightness);
        color.front.g = Math.round(((cubeColor.front.g + solarColor.g * solarIntensity[4]) / (2 * 100)) * brightness);
        color.front.b = Math.round(((cubeColor.front.b + solarColor.b * solarIntensity[4]) / (2 * 100)) * brightness);

        return color;
    };


    // ------------------------------------------------------------------------------------------------------------------------------ Public

    pub.init = function (config) {
        priv.overwriteConfig(config);
    };


    pub.getColorsByTime = function getColorsByTime(time) {
        return priv.getUpdatedColors(time);
    };
    
    // ------------------------------------------------------------------------------------------------ Return

    return pub;

}
