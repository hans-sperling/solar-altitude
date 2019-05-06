jQuery(document).ready(function() {
  'use strict';

  const animate = false;
  const day     = 24;
  let time      = 8;
  let color;

  const solarColorList = [
    { r: 0,   g: 0,   b: 255 }, // 00:00 - Midnight color
    { r: 255, g: 0,   b: 0   }, // 06:00 - Sunrise color
    { r: 255, g: 255, b: 0   }, // 12:00 - Midday color
    { r: 255, g: 0,   b: 0   }  // 18:00 - Sunset color
  ];
  const solarIntensityList = [
    // [ north, east, south, west, front]
    [0.8, 0.5, 0.2, 0.5, 1.0], // 00:00 - Solar light shines from the north
    [0.5, 0.8, 0.5, 0.2, 1.0], // 06:00 - Solar light shines from the east
    [0.2, 0.5, 0.8, 0.5, 1.0], // 12:00 - Solar light shines from the south
    [0.5, 0.2, 0.5, 0.8, 1.0]  // 18:00 - Solar light shines from the west
  ];
  const brightness = {
    min: 25,
    max: 100
  };

  const cubes = [{
    domId : '#cubeRed',
    colors : {
      north : {r: 255, g: 0, b: 0},
      east  : {r: 255, g: 0, b: 0},
      south : {r: 255, g: 0, b: 0},
      west  : {r: 255, g: 0, b: 0},
      front : {r: 255, g: 0, b: 0},
      back  : {r: 255, g: 0, b: 0}
    },
    shapes : {
      north : $('#cubeRed .north'),
      east  : $('#cubeRed .east'),
      south : $('#cubeRed .south'),
      west  : $('#cubeRed .west'),
      front : $('#cubeRed .front')
    }}, {
    domId : '#cubeGreen',
    colors : {
      north : {r: 0, g: 255, b: 0},
      east  : {r: 0, g: 255, b: 0},
      south : {r: 0, g: 255, b: 0},
      west  : {r: 0, g: 255, b: 0},
      front : {r: 0, g: 255, b: 0},
      back  : {r: 0, g: 255, b: 0}
    },
    shapes : {
      north : $('#cubeGreen .north'),
      east  : $('#cubeGreen .east'),
      south : $('#cubeGreen .south'),
      west  : $('#cubeGreen .west'),
      front : $('#cubeGreen .front')
    }}, {
    domId : '#cubeBlue',
    colors : {
      north : {r: 0, g: 0, b: 255},
      east  : {r: 0, g: 0, b: 255},
      south : {r: 0, g: 0, b: 255},
      west  : {r: 0, g: 0, b: 255},
      front : {r: 0, g: 0, b: 255},
      back  : {r: 0, g: 0, b: 255}
    },
    shapes : {
      north : $('#cubeBlue .north'),
      east  : $('#cubeBlue .east'),
      south : $('#cubeBlue .south'),
      west  : $('#cubeBlue .west'),
      front : $('#cubeBlue .front')
    }}, {
    domId : '#cubeWhite',
    colors : {
      north : {r: 255, g: 255, b: 255},
      east  : {r: 255, g: 255, b: 255},
      south : {r: 255, g: 255, b: 255},
      west  : {r: 255, g: 255, b: 255},
      front : {r: 255, g: 255, b: 255},
      back  : {r: 255, g: 255, b: 255}
    },
    shapes : {
      north : $('#cubeWhite .north'),
      east  : $('#cubeWhite .east'),
      south : $('#cubeWhite .south'),
      west  : $('#cubeWhite .west'),
      front : $('#cubeWhite .front')
    }}, {
    domId : '#cubeGrey',
    colors : {
      north : {r: 127, g: 127, b: 127},
      east  : {r: 127, g: 127, b: 127},
      south : {r: 127, g: 127, b: 127},
      west  : {r: 127, g: 127, b: 127},
      front : {r: 127, g: 127, b: 127},
      back  : {r: 127, g: 127, b: 127}
    },
    shapes : {
      north : $('#cubeGrey .north'),
      east  : $('#cubeGrey .east'),
      south : $('#cubeGrey .south'),
      west  : $('#cubeGrey .west'),
      front : $('#cubeGrey .front')
    }}, {
    domId : '#cubeBlack',
    colors : {
      north : {r: 0, g: 0, b: 0},
      east  : {r: 0, g: 0, b: 0},
      south : {r: 0, g: 0, b: 0},
      west  : {r: 0, g: 0, b: 0},
      front : {r: 0, g: 0, b: 0},
      back  : {r: 0, g: 0, b: 0}
    },
    shapes : {
      north : $('#cubeBlack .north'),
      east  : $('#cubeBlack .east'),
      south : $('#cubeBlack .south'),
      west  : $('#cubeBlack .west'),
      front : $('#cubeBlack .front')
    }},
  ];
  let instances = [];

  // ---------------------------------------------------------------------------------------------------------------------------------- Init

  init();

  // ----------------------------------------------------------------------------------------------------------------------------------- Run

  if (animate) {
    // Simulate a day
    setInterval(function() {
      console.log('Current time: ', time);
      frame(time);
      time = getTime(time, day);
    }, 100);
  } else {
    console.log('Current time: ', time);
    frame(time);
  }

  // ----------------------------------------------------------------------------------------------------------------------------- Functions

  function init() {
    for (let i = 0; i < cubes.length; i++) {
      instances[i] = new SolarAltitude(window, document, jQuery, cubes[i].domId);

      instances[i].init({
        time               : time,
        day                : day,
        brightness         : brightness,
        cubeColor          : cubes[i].colors,
        solarColorList     : solarColorList,
        solarIntensityList : solarIntensityList
      });
    }
  }


  function frame(time) {
    let instance;
    let cube;

    for (let i = 0; i < cubes.length; i++) {
      instance = instances[i];
      cube     = cubes[i];

      color = instance.getColorsByTime(time);

      cube.shapes.north.css('background', 'rgb(' + color.north.r + ',' + color.north.g + ',' + color.north.b + ')');
      cube.shapes.east.css('background',  'rgb(' + color.east.r  + ',' + color.east.g  + ',' + color.east.b  + ')');
      cube.shapes.south.css('background', 'rgb(' + color.south.r + ',' + color.south.g + ',' + color.south.b + ')');
      cube.shapes.west.css('background',  'rgb(' + color.west.r  + ',' + color.west.g  + ',' + color.west.b  + ')');
      cube.shapes.front.css('background', 'rgb(' + color.front.r + ',' + color.front.g + ',' + color.front.b + ')');
    }
  }


  /**
   * Get the current time.
   */
  function getTime(time, day) {
    time = Math.round((time + 0.1) * 100) / 100;

    if (time >= day) {
      return 0;
    }
    else {
      return time;
    }
  }
});






