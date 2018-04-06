(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){
'use strict'

var fs = require('fs')

/*
 * Parses a string or buffer into an object
 * @param {String|Buffer} src - source to be parsed
 * @returns {Object}
*/
function parse (src) {
  var obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split('\n').forEach(function (line) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    var keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/)
    // matched?
    if (keyValueArr != null) {
      var key = keyValueArr[1]

      // default undefined or missing values to empty string
      var value = keyValueArr[2] ? keyValueArr[2] : ''

      // expand newlines in quoted values
      var len = value ? value.length : 0
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n')
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim()

      obj[key] = value
    }
  })

  return obj
}

/*
 * Main entry point into dotenv. Allows configuration before loading .env
 * @param {Object} options - valid options: path ('.env'), encoding ('utf8')
 * @returns {Boolean}
*/
function config (options) {
  var path = '.env'
  var encoding = 'utf8'

  if (options) {
    if (options.path) {
      path = options.path
    }
    if (options.encoding) {
      encoding = options.encoding
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    var parsedObj = parse(fs.readFileSync(path, { encoding: encoding }))

    Object.keys(parsedObj).forEach(function (key) {
      process.env[key] = process.env[key] || parsedObj[key]
    })

    return { parsed: parsedObj }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.load = config
module.exports.parse = parse

}).call(this,require('_process'))

},{"_process":2,"fs":3}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
module.exports = [
  {
    name: 'index',
    bpm: 120,
    gradientColors: ['#fdbb2d', '#22c1c3'],
    spectrumColors: ['#EAEAEA', '#DBDBDB', '#F2F2F2'],
    size: [0.5, 0.4, 0.3],
    thickness: [2, 1.5, 1],
    bounce: [0.25, 0.5, 1],
    morph: [1, 4, 7],
    soundcloudUrl: 'https://soundcloud.com/moai_music/intro'
  }, 
  {
    name: 'boy',
    bpm: 120,
    gradientColors: ['#43cea2', '#185a9d'],
    spectrumColors: ['#EAEAEA', '#DBDBDB', '#F2F2F2'],
    size: [0.35, 0.15, 0.27], // max 0.3
    thickness: [1, 0.75, 0.5],
    bounce: [2, 0.5, 1],
    morph: [20, 5, 1],
    soundcloudUrl: 'https://soundcloud.com/moai_music/vovka'
  }, 
  {
    name: 'girl',
    bpm: 120,
    gradientColors: ['#ff6a00', '#ee0979'],    
    spectrumColors: ['#EAEAEA', '#DBDBDB', '#F2F2F2'],
    size: [0.3, 0.15, 0.06], // max 0.3
    thickness: [1, 0.75, 0.5],
    bounce: [1, 0.8, 0.7],
    morph: [5, 20, 1],
    soundcloudUrl: 'https://soundcloud.com/moai_music/rojo'
  }, 
  {
    name: 'soul',
    bpm: 120,
    gradientColors: ['#fdbb2d', '#22c1c3'],    
    spectrumColors: ['#EAEAEA', '#DBDBDB', '#F2F2F2'],
    size: [0.3, 0.2, 0.05],
    thickness: [1, 0.75, 0.5],
    bounce: [1, 0.8, 0.7],
    morph: [17, 20, 1],
    soundcloudUrl: 'https://soundcloud.com/moai_music/lisboa'
  }
];

// background:#de6161;background:-webkit-linear-gradient(to right,#2657eb,#de6161);background:linear-gradient(to right,#2657eb,#de6161);

},{}],5:[function(require,module,exports){
(function (process){
'use-strict';

// const argv = require('yargs').argv

var App = {
  debug: process.env.DEBUG === 'true' ? true : false,
  spectrums: [],
  song: null
};

module.exports = App;
}).call(this,require('_process'))

},{"_process":2}],6:[function(require,module,exports){
'use-strict';

var Framework = function() {
  this.menuOpen = null;
  this.menuClose = null;
  this.volumeOn = null;
  this.volumeOff = null;
  this.menuPage = null;
  this.menuContent = null;
  this.navPrevious = null;
  this.navNext = null;
  this.framework = null;
  this.morpher = null;
  this.instructions = null;
  this.getElements();
  this.initEventListeners();
  
  //init global values
  window.count = 0;
  window.menuIsOpen = false;
  window.spectrumSelection = 0;

  
  setInterval(function() {
    if(window.count > 5 && !window.menuIsOpen) {
      this.framework.classList.add('hide');
    }

    window.count += 1;
  }, 1000);
};


Framework.prototype.getElements = function() {
  this.menuOpen = document.getElementById('menu-open');
  this.menuClose = document.getElementById('menu-closed');
  this.volumeOn = document.getElementById('volume-on');
  this.volumeOff = document.getElementById('volume-off');
  this.menuPage = document.getElementById('menu-page');
  this.menuContent = document.getElementById('menu-content');
  this.navPrevious = document.getElementById('nav-previous');
  this.navNext = document.getElementById('nav-next');
  this.framework = document.getElementById('framework');
  this.morpher = document.getElementsByClassName('title')[0];
  this.instructions = document.getElementById('instructions');
};


Framework.prototype.initEventListeners = function() {
  if(this.menuOpen !== null){
    this.menuOpen.addEventListener("click", function() {
      this.toggleMenu_(true);
    }.bind(this));
  
    this.menuClose.addEventListener("click", function() {
      this.toggleMenu_(false);
    }.bind(this));
  
    this.morpher.addEventListener("click", function() {
      this.morph_();
    }.bind(this));
  
    this.morpher.addEventListener("mousemove", function(e) {
      this.stretch_(e);
    }.bind(this));
  
    this.volumeOn.addEventListener("click", function() {
      this.toggleVolume_(false);
    }.bind(this));
  
    this.volumeOff.addEventListener("click", function() {
      this.toggleVolume_(true);
    }.bind(this));

    this.framework.addEventListener("mousemove", function(e) {
      this.resetCounter();
    }.bind(this));
  }

  var that = this;
  setTimeout(function() {
    that.instructions.classList.add('hide')
  }, 15000)
};

Framework.prototype.resetCounter = function() {
  window.count = 0;
  this.framework.classList.remove('hide');
};


Framework.prototype.toggleMenu_ = function(open) {
  if(open) { 
    this.menuPage.classList.add('display');
    this.menuContent.classList.add('display');
    this.menuOpen.classList.add('hidden');
    this.menuClose.classList.remove('hidden');
    window.menuIsOpen = true;    

  } else {
    this.menuPage.classList.remove('display');
    this.menuContent.classList.remove('display');
    this.menuOpen.classList.remove('hidden');
    this.menuClose.classList.add('hidden');
    window.menuIsOpen = false;
    
  }
};


Framework.prototype.toggleVolume_ = function(on) {
  if(on) {
    window.globalP5.masterVolume = 1;
    this.volumeOn.classList.remove('hidden');
    this.volumeOff.classList.add('hidden');
    
  } else {
    window.globalP5.masterVolume = 0;
    this.volumeOn.classList.add('hidden');
    this.volumeOff.classList.remove('hidden');
  }
};


Framework.prototype.morph_ = function() {
  console.log('morphing')
  var morphVal = Math.ceil(Math.random() * 20);

  window.thisApp.spectrums[window.spectrumSelection].morph = morphVal;

  window.spectrumSelection = window.spectrumSelection === 2 
    ? 0
    : window.spectrumSelection += 1;
};


Framework.prototype.stretch_ = function(e) {
  var x = e.clientX / window.innerWidth;
  var y = e.clientY / window.innerHeight;
  var bounceVal = Math.max(0.2, Math.abs(0.5 - Math.max(x, y)) * 3);

  window.thisApp.spectrums[window.spectrumSelection].bounce = bounceVal;
};





module.exports = Framework;
},{}],7:[function(require,module,exports){
'use-strict';

var App = require('./app');
var Framework = require('./framework');
var Spectrum = require('./spectrum');
var Sketch = require('./sketch');
var Debug = require('./utilities/debug');
var Song = require('./song');
var data = require('../../data/data');
var getIndex = require('./utilities/getIndex');


var initApp = function() { //debugger;
  // Framework init
  var framework = new Framework();
  framework.getElements();
  framework.initEventListeners();

  App.framework = framework;
  
  // Spectrum init
  var p = getSpectrumParams(); 
  
  Debug(p);

  var s1 = new Spectrum('s1', p.colors[0], p.size[0], p.thickness[0], p.bounce[0], p.morph[0]); 
  var s2 = new Spectrum('s2', p.colors[1], p.size[1], p.thickness[1], p.bounce[1], p.morph[1]); 
  var s3 = new Spectrum('s3', p.colors[2], p.size[2], p.thickness[2], p.bounce[2], p.morph[2]); 
  
  App.spectrums.push(s1);
  App.spectrums.push(s2);
  App.spectrums.push(s3);

  // Song init
  App.song = new Song();
  
  // put this app object into the global window
  window.thisApp = App;
  
  // P5 sketch
  var moaiP5 = new p5(Sketch, 'layer1');
};


window.onload = function() {
  initApp();
};


var getSpectrumParams = function() {
  var i = getIndex();

  var dynamicSpectrumHeights =  data[i].size
    .map(function(ratio) {
      return ratio *  Math.min(window.innerHeight, window.innerWidth);
    });
  
  return {
    name: data[i].name,
    colors: data[i].spectrumColors,
    size: dynamicSpectrumHeights,
    thickness: data[i].thickness,
    bounce: data[i].bounce,
    morph: data[i].morph
  }
};
},{"../../data/data":4,"./app":5,"./framework":6,"./sketch":8,"./song":9,"./spectrum":10,"./utilities/debug":11,"./utilities/getIndex":12}],8:[function(require,module,exports){
(function (process){
'use-strict';

require('dotenv').config();
var App = require('./app');
var Song = require('./song');
var Debug = require('./utilities/debug');
var getIndex = require('./utilities/getIndex');


var s = function(sketch) { //debugger;
  var loaded = false;
  window.globalP5 = sketch; // global copy of p5

  sketch.preload = function() {
    var index = getIndex();
    console.log('process.env.ENV', process.env.ENV);
    var path = process.env.ENV === 'production' ? '/dist' : '/public';
    var url = path + '/audio/' + index + '.mp3';
    window.thisApp.song.sound = globalP5.loadSound(url);
  };

  sketch.setup = function() {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);  
    sketch.frameRate(20);
    window.thisApp.song.play();
  };
  
  sketch.draw = function() {
    if(!loaded) {
      document.getElementById('layer1').classList.remove('hidden');
      this.loaded = true;
    };

    if(typeof window.thisApp !== 'undefined') {
      sketch.clear();
      sketch.background('rgba(255, 255, 255, 0)');
    
      window.thisApp.song.setWaveform();
    
      for(var j = 0; j < App.spectrums.length; j++) {
        window.thisApp.spectrums[j].draw(sketch);
      }
    }
  };
};

module.exports = s;
}).call(this,require('_process'))

},{"./app":5,"./song":9,"./utilities/debug":11,"./utilities/getIndex":12,"_process":2,"dotenv":1}],9:[function(require,module,exports){
var Song = function() {
  this.timeData = [];
  this.songId = this.getSongId_();
  this.sound; /*= this.loadSound_();*/
  this.duration /*= this.getSongDuration_();*/
  this.bpm = this.getBPM();
  this.fft = this.getFFT_();
  this.waveform = this.fft.waveform();
  this.spectrum = this.fft.analyze();
  this.bassEnergy = this.fft.getEnergy('bass');
  this.midEnergy = this.fft.getEnergy('mid');
  this.highEnergy = this.fft.getEnergy('treble');
  this.getTimeCalculations_();
};

Song.prototype.getSongId_ = function() {
  if(window.location.pathname.length === 1) {
    return 'index';
  } else {
    // 6 = /song/
    return window.location.pathname.slice(6, window.location.pathname.length);
  }
};

Song.prototype.getBPM = function() {
  return 120;
};

Song.prototype.loadSound_ = function(moaiP5) { //debugger;
  // var url = '/public/audio/'+ this.songId +'.mp3';
  // return globalP5.loadSound(url);
};

Song.prototype.getSongDuration_ = function() {
  return this.sound.duration();
};

Song.prototype.play = function() {
  this.sound.play();
};

Song.prototype.getFFT_ = function(moaiP5) {
  return new window.p5.FFT;
};

Song.prototype.getWaveform = function() {
  return this.waveform;
};

Song.prototype.setWaveform = function() {
  this.waveform = this.fft.waveform();
};

Song.prototype.getSpectral = function() {
  return this.spectrum;
};

Song.prototype.setSpectral = function() {
  this.spectrum = this.fft.analyze();
};

Song.prototype.getEnergy_ = function(frequencyRange) {
  return this.fft.getEnergy(frequencyRange);
};

Song.prototype.volumeOn = function(moaiP5) {
  window.p5.masterVolume(1);
};

Song.prototype.volumeOff = function(moaiP5) {
  window.p5.masterVolume(0);
};

Song.prototype.getTimeCalculations_ = function() {
    var base = 240000 / this.bpm;

    for(var i = 1; i <= 16; i++) {
      var key = i.toString();
      var value = base / i;
      this.timeData.push({ key: value });
    }
};

module.exports = Song;
},{}],10:[function(require,module,exports){
var Spectrum = function(name, color, size, thickness, bounce, morph) {
  this.name = name;
  this.color = color;
  this.size = size;
  this.thickness = thickness;
  this.bounce = bounce;
  this.morph = morph;
  this.waveform = [];
};

Spectrum.prototype.setColor_ = function(newColor) {
  this.color = newColor;
};

Spectrum.prototype.setSize_ = function(newSize) {
    this.size = newSize;
};

Spectrum.prototype.setThickness_ = function(newThickness) {
  this.thickness = newThickness;
};

Spectrum.prototype.setBounce_ = function(newBounce) {
  this.bounce = newBounce;
};

Spectrum.prototype.setMorph_ = function(newMorph) {
  this.morph = newMorph;
};

Spectrum.prototype.addToGroup_ = function() {
  spectrums.push(this);
};

Spectrum.prototype.draw =  function(sketch) {
  sketch.noFill();
  sketch.stroke(this.color);
  sketch.strokeWeight(this.thickness);
  sketch.beginShape();

  for (var i = 0; i < 360; i++){

    var wave = this.getDynamicLength_(i, sketch);

    var x1 = this.getCircularX_(i, sketch);
    var y1 = this.getCircularY_(i, sketch);

    var x_wave = this.pitchX_(wave, i);
    var y_wave = this.pitchY_(wave, i);

    var x2 = x1 + x_wave;
    var y2 = y1 + y_wave;

    sketch.curveVertex(x2, y2);
  }
  sketch.endShape();
};

Spectrum.prototype.getDynamicLength_ = function(i, sketch) {
  var waveform = window.thisApp.song.getWaveform();
  // return sketch.map(waveform[i * this.morph] / this.bounce, -1, 1, 0, 150);
  return sketch.map(waveform[i * this.morph] / this.bounce, -1, 1, 0, 150);
};

Spectrum.prototype.getCircularX_ = function(i, sketch) {
  return (this.size * Math.sin(i * this.morph) + sketch.width / 2);
};

Spectrum.prototype.getCircularY_ = function(i, sketch) {
  return (this.size * Math.cos(i * this.morph) + sketch.height / 2);
};

Spectrum.prototype.pitchX_ = function(wave, i) {
  return wave * Math.sin(i);
};

Spectrum.prototype.pitchY_ = function(wave, i) {
  return wave * Math.cos(i);
};

Spectrum.prototype.changeColor_ = function() {};


module.exports = Spectrum;
},{}],11:[function(require,module,exports){
(function (process){
'use strict';

var App = require('../app');

var Debug = function(/* arguments */) { //debugger;
  if(process.env.ENV === 'development') {
    var prints = Array.from(arguments);
  
    prints.map(function(item, i) {
      if(typeof arguments !== 'undefined') {
        var print = typeof item === 'object' 
          ? JSON.stringify(item) 
          : item
        
          console.log(i, print);
      };
    });
  };
};

module.exports = Debug;
}).call(this,require('_process'))

},{"../app":5,"_process":2}],12:[function(require,module,exports){
var getIndex = function() {
  return window.location.pathname.length === 1 
    ? 'index'
    : window.location.pathname.slice(6, window.location.pathname.length); // num  
};

module.exports = getIndex;
},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG90ZW52L2xpYi9tYWluLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwicHVibGljL2RhdGEvZGF0YS5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2FwcC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2ZyYW1ld29yay5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2luaXQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9za2V0Y2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9zb25nLmpzIiwicHVibGljL2pzL21vZHVsZXMvc3BlY3RydW0uanMiLCJwdWJsaWMvanMvbW9kdWxlcy91dGlsaXRpZXMvZGVidWcuanMiLCJwdWJsaWMvanMvbW9kdWxlcy91dGlsaXRpZXMvZ2V0SW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCdcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuXG4vKlxuICogUGFyc2VzIGEgc3RyaW5nIG9yIGJ1ZmZlciBpbnRvIGFuIG9iamVjdFxuICogQHBhcmFtIHtTdHJpbmd8QnVmZmVyfSBzcmMgLSBzb3VyY2UgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuKi9cbmZ1bmN0aW9uIHBhcnNlIChzcmMpIHtcbiAgdmFyIG9iaiA9IHt9XG5cbiAgLy8gY29udmVydCBCdWZmZXJzIGJlZm9yZSBzcGxpdHRpbmcgaW50byBsaW5lcyBhbmQgcHJvY2Vzc2luZ1xuICBzcmMudG9TdHJpbmcoKS5zcGxpdCgnXFxuJykuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgIC8vIG1hdGNoaW5nIFwiS0VZJyBhbmQgJ1ZBTCcgaW4gJ0tFWT1WQUwnXG4gICAgdmFyIGtleVZhbHVlQXJyID0gbGluZS5tYXRjaCgvXlxccyooW1xcd1xcLlxcLV0rKVxccyo9XFxzKiguKik/XFxzKiQvKVxuICAgIC8vIG1hdGNoZWQ/XG4gICAgaWYgKGtleVZhbHVlQXJyICE9IG51bGwpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlWYWx1ZUFyclsxXVxuXG4gICAgICAvLyBkZWZhdWx0IHVuZGVmaW5lZCBvciBtaXNzaW5nIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdcbiAgICAgIHZhciB2YWx1ZSA9IGtleVZhbHVlQXJyWzJdID8ga2V5VmFsdWVBcnJbMl0gOiAnJ1xuXG4gICAgICAvLyBleHBhbmQgbmV3bGluZXMgaW4gcXVvdGVkIHZhbHVlc1xuICAgICAgdmFyIGxlbiA9IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMFxuICAgICAgaWYgKGxlbiA+IDAgJiYgdmFsdWUuY2hhckF0KDApID09PSAnXCInICYmIHZhbHVlLmNoYXJBdChsZW4gLSAxKSA9PT0gJ1wiJykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcXFxuL2dtLCAnXFxuJylcbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIGFueSBzdXJyb3VuZGluZyBxdW90ZXMgYW5kIGV4dHJhIHNwYWNlc1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8oXlsnXCJdfFsnXCJdJCkvZywgJycpLnRyaW0oKVxuXG4gICAgICBvYmpba2V5XSA9IHZhbHVlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBvYmpcbn1cblxuLypcbiAqIE1haW4gZW50cnkgcG9pbnQgaW50byBkb3RlbnYuIEFsbG93cyBjb25maWd1cmF0aW9uIGJlZm9yZSBsb2FkaW5nIC5lbnZcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdmFsaWQgb3B0aW9uczogcGF0aCAoJy5lbnYnKSwgZW5jb2RpbmcgKCd1dGY4JylcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuKi9cbmZ1bmN0aW9uIGNvbmZpZyAob3B0aW9ucykge1xuICB2YXIgcGF0aCA9ICcuZW52J1xuICB2YXIgZW5jb2RpbmcgPSAndXRmOCdcblxuICBpZiAob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLnBhdGgpIHtcbiAgICAgIHBhdGggPSBvcHRpb25zLnBhdGhcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuZW5jb2RpbmcpIHtcbiAgICAgIGVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZ1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gc3BlY2lmeWluZyBhbiBlbmNvZGluZyByZXR1cm5zIGEgc3RyaW5nIGluc3RlYWQgb2YgYSBidWZmZXJcbiAgICB2YXIgcGFyc2VkT2JqID0gcGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGgsIHsgZW5jb2Rpbmc6IGVuY29kaW5nIH0pKVxuXG4gICAgT2JqZWN0LmtleXMocGFyc2VkT2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHByb2Nlc3MuZW52W2tleV0gPSBwcm9jZXNzLmVudltrZXldIHx8IHBhcnNlZE9ialtrZXldXG4gICAgfSlcblxuICAgIHJldHVybiB7IHBhcnNlZDogcGFyc2VkT2JqIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IGVycm9yOiBlIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb25maWcgPSBjb25maWdcbm1vZHVsZS5leHBvcnRzLmxvYWQgPSBjb25maWdcbm1vZHVsZS5leHBvcnRzLnBhcnNlID0gcGFyc2VcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAge1xuICAgIG5hbWU6ICdpbmRleCcsXG4gICAgYnBtOiAxMjAsXG4gICAgZ3JhZGllbnRDb2xvcnM6IFsnI2ZkYmIyZCcsICcjMjJjMWMzJ10sXG4gICAgc3BlY3RydW1Db2xvcnM6IFsnI0VBRUFFQScsICcjREJEQkRCJywgJyNGMkYyRjInXSxcbiAgICBzaXplOiBbMC41LCAwLjQsIDAuM10sXG4gICAgdGhpY2tuZXNzOiBbMiwgMS41LCAxXSxcbiAgICBib3VuY2U6IFswLjI1LCAwLjUsIDFdLFxuICAgIG1vcnBoOiBbMSwgNCwgN10sXG4gICAgc291bmRjbG91ZFVybDogJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vbW9haV9tdXNpYy9pbnRybydcbiAgfSwgXG4gIHtcbiAgICBuYW1lOiAnYm95JyxcbiAgICBicG06IDEyMCxcbiAgICBncmFkaWVudENvbG9yczogWycjNDNjZWEyJywgJyMxODVhOWQnXSxcbiAgICBzcGVjdHJ1bUNvbG9yczogWycjRUFFQUVBJywgJyNEQkRCREInLCAnI0YyRjJGMiddLFxuICAgIHNpemU6IFswLjM1LCAwLjE1LCAwLjI3XSwgLy8gbWF4IDAuM1xuICAgIHRoaWNrbmVzczogWzEsIDAuNzUsIDAuNV0sXG4gICAgYm91bmNlOiBbMiwgMC41LCAxXSxcbiAgICBtb3JwaDogWzIwLCA1LCAxXSxcbiAgICBzb3VuZGNsb3VkVXJsOiAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9tb2FpX211c2ljL3ZvdmthJ1xuICB9LCBcbiAge1xuICAgIG5hbWU6ICdnaXJsJyxcbiAgICBicG06IDEyMCxcbiAgICBncmFkaWVudENvbG9yczogWycjZmY2YTAwJywgJyNlZTA5NzknXSwgICAgXG4gICAgc3BlY3RydW1Db2xvcnM6IFsnI0VBRUFFQScsICcjREJEQkRCJywgJyNGMkYyRjInXSxcbiAgICBzaXplOiBbMC4zLCAwLjE1LCAwLjA2XSwgLy8gbWF4IDAuM1xuICAgIHRoaWNrbmVzczogWzEsIDAuNzUsIDAuNV0sXG4gICAgYm91bmNlOiBbMSwgMC44LCAwLjddLFxuICAgIG1vcnBoOiBbNSwgMjAsIDFdLFxuICAgIHNvdW5kY2xvdWRVcmw6ICdodHRwczovL3NvdW5kY2xvdWQuY29tL21vYWlfbXVzaWMvcm9qbydcbiAgfSwgXG4gIHtcbiAgICBuYW1lOiAnc291bCcsXG4gICAgYnBtOiAxMjAsXG4gICAgZ3JhZGllbnRDb2xvcnM6IFsnI2ZkYmIyZCcsICcjMjJjMWMzJ10sICAgIFxuICAgIHNwZWN0cnVtQ29sb3JzOiBbJyNFQUVBRUEnLCAnI0RCREJEQicsICcjRjJGMkYyJ10sXG4gICAgc2l6ZTogWzAuMywgMC4yLCAwLjA1XSxcbiAgICB0aGlja25lc3M6IFsxLCAwLjc1LCAwLjVdLFxuICAgIGJvdW5jZTogWzEsIDAuOCwgMC43XSxcbiAgICBtb3JwaDogWzE3LCAyMCwgMV0sXG4gICAgc291bmRjbG91ZFVybDogJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vbW9haV9tdXNpYy9saXNib2EnXG4gIH1cbl07XG5cbi8vIGJhY2tncm91bmQ6I2RlNjE2MTtiYWNrZ3JvdW5kOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCMyNjU3ZWIsI2RlNjE2MSk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIzI2NTdlYiwjZGU2MTYxKTtcbiIsIid1c2Utc3RyaWN0JztcblxuLy8gY29uc3QgYXJndiA9IHJlcXVpcmUoJ3lhcmdzJykuYXJndlxuXG52YXIgQXBwID0ge1xuICBkZWJ1ZzogcHJvY2Vzcy5lbnYuREVCVUcgPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZSxcbiAgc3BlY3RydW1zOiBbXSxcbiAgc29uZzogbnVsbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHA7IiwiJ3VzZS1zdHJpY3QnO1xuXG52YXIgRnJhbWV3b3JrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubWVudU9wZW4gPSBudWxsO1xuICB0aGlzLm1lbnVDbG9zZSA9IG51bGw7XG4gIHRoaXMudm9sdW1lT24gPSBudWxsO1xuICB0aGlzLnZvbHVtZU9mZiA9IG51bGw7XG4gIHRoaXMubWVudVBhZ2UgPSBudWxsO1xuICB0aGlzLm1lbnVDb250ZW50ID0gbnVsbDtcbiAgdGhpcy5uYXZQcmV2aW91cyA9IG51bGw7XG4gIHRoaXMubmF2TmV4dCA9IG51bGw7XG4gIHRoaXMuZnJhbWV3b3JrID0gbnVsbDtcbiAgdGhpcy5tb3JwaGVyID0gbnVsbDtcbiAgdGhpcy5pbnN0cnVjdGlvbnMgPSBudWxsO1xuICB0aGlzLmdldEVsZW1lbnRzKCk7XG4gIHRoaXMuaW5pdEV2ZW50TGlzdGVuZXJzKCk7XG4gIFxuICAvL2luaXQgZ2xvYmFsIHZhbHVlc1xuICB3aW5kb3cuY291bnQgPSAwO1xuICB3aW5kb3cubWVudUlzT3BlbiA9IGZhbHNlO1xuICB3aW5kb3cuc3BlY3RydW1TZWxlY3Rpb24gPSAwO1xuXG4gIFxuICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBpZih3aW5kb3cuY291bnQgPiA1ICYmICF3aW5kb3cubWVudUlzT3Blbikge1xuICAgICAgdGhpcy5mcmFtZXdvcmsuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgIH1cblxuICAgIHdpbmRvdy5jb3VudCArPSAxO1xuICB9LCAxMDAwKTtcbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1lbnVPcGVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtb3BlbicpO1xuICB0aGlzLm1lbnVDbG9zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNsb3NlZCcpO1xuICB0aGlzLnZvbHVtZU9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZvbHVtZS1vbicpO1xuICB0aGlzLnZvbHVtZU9mZiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2b2x1bWUtb2ZmJyk7XG4gIHRoaXMubWVudVBhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1wYWdlJyk7XG4gIHRoaXMubWVudUNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jb250ZW50Jyk7XG4gIHRoaXMubmF2UHJldmlvdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXByZXZpb3VzJyk7XG4gIHRoaXMubmF2TmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbmV4dCcpO1xuICB0aGlzLmZyYW1ld29yayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcmFtZXdvcmsnKTtcbiAgdGhpcy5tb3JwaGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGl0bGUnKVswXTtcbiAgdGhpcy5pbnN0cnVjdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zdHJ1Y3Rpb25zJyk7XG59O1xuXG5cbkZyYW1ld29yay5wcm90b3R5cGUuaW5pdEV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gIGlmKHRoaXMubWVudU9wZW4gIT09IG51bGwpe1xuICAgIHRoaXMubWVudU9wZW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50b2dnbGVNZW51Xyh0cnVlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICBcbiAgICB0aGlzLm1lbnVDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRvZ2dsZU1lbnVfKGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICBcbiAgICB0aGlzLm1vcnBoZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5tb3JwaF8oKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICBcbiAgICB0aGlzLm1vcnBoZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICB0aGlzLnN0cmV0Y2hfKGUpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIFxuICAgIHRoaXMudm9sdW1lT24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50b2dnbGVWb2x1bWVfKGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICBcbiAgICB0aGlzLnZvbHVtZU9mZi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRvZ2dsZVZvbHVtZV8odHJ1ZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuZnJhbWV3b3JrLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgdGhpcy5yZXNldENvdW50ZXIoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHRoYXQuaW5zdHJ1Y3Rpb25zLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICB9LCAxNTAwMClcbn07XG5cbkZyYW1ld29yay5wcm90b3R5cGUucmVzZXRDb3VudGVyID0gZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5jb3VudCA9IDA7XG4gIHRoaXMuZnJhbWV3b3JrLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS50b2dnbGVNZW51XyA9IGZ1bmN0aW9uKG9wZW4pIHtcbiAgaWYob3BlbikgeyBcbiAgICB0aGlzLm1lbnVQYWdlLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKTtcbiAgICB0aGlzLm1lbnVDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKTtcbiAgICB0aGlzLm1lbnVPcGVuLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHRoaXMubWVudUNsb3NlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIHdpbmRvdy5tZW51SXNPcGVuID0gdHJ1ZTsgICAgXG5cbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lbnVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKTtcbiAgICB0aGlzLm1lbnVDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKTtcbiAgICB0aGlzLm1lbnVPcGVuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIHRoaXMubWVudUNsb3NlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHdpbmRvdy5tZW51SXNPcGVuID0gZmFsc2U7XG4gICAgXG4gIH1cbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS50b2dnbGVWb2x1bWVfID0gZnVuY3Rpb24ob24pIHtcbiAgaWYob24pIHtcbiAgICB3aW5kb3cuZ2xvYmFsUDUubWFzdGVyVm9sdW1lID0gMTtcbiAgICB0aGlzLnZvbHVtZU9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIHRoaXMudm9sdW1lT2ZmLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIFxuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5nbG9iYWxQNS5tYXN0ZXJWb2x1bWUgPSAwO1xuICAgIHRoaXMudm9sdW1lT24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgdGhpcy52b2x1bWVPZmYuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gIH1cbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS5tb3JwaF8gPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJ21vcnBoaW5nJylcbiAgdmFyIG1vcnBoVmFsID0gTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiAyMCk7XG5cbiAgd2luZG93LnRoaXNBcHAuc3BlY3RydW1zW3dpbmRvdy5zcGVjdHJ1bVNlbGVjdGlvbl0ubW9ycGggPSBtb3JwaFZhbDtcblxuICB3aW5kb3cuc3BlY3RydW1TZWxlY3Rpb24gPSB3aW5kb3cuc3BlY3RydW1TZWxlY3Rpb24gPT09IDIgXG4gICAgPyAwXG4gICAgOiB3aW5kb3cuc3BlY3RydW1TZWxlY3Rpb24gKz0gMTtcbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS5zdHJldGNoXyA9IGZ1bmN0aW9uKGUpIHtcbiAgdmFyIHggPSBlLmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgdmFyIHkgPSBlLmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIHZhciBib3VuY2VWYWwgPSBNYXRoLm1heCgwLjIsIE1hdGguYWJzKDAuNSAtIE1hdGgubWF4KHgsIHkpKSAqIDMpO1xuXG4gIHdpbmRvdy50aGlzQXBwLnNwZWN0cnVtc1t3aW5kb3cuc3BlY3RydW1TZWxlY3Rpb25dLmJvdW5jZSA9IGJvdW5jZVZhbDtcbn07XG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGcmFtZXdvcms7IiwiJ3VzZS1zdHJpY3QnO1xuXG52YXIgQXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcbnZhciBGcmFtZXdvcmsgPSByZXF1aXJlKCcuL2ZyYW1ld29yaycpO1xudmFyIFNwZWN0cnVtID0gcmVxdWlyZSgnLi9zcGVjdHJ1bScpO1xudmFyIFNrZXRjaCA9IHJlcXVpcmUoJy4vc2tldGNoJyk7XG52YXIgRGVidWcgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9kZWJ1ZycpO1xudmFyIFNvbmcgPSByZXF1aXJlKCcuL3NvbmcnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9kYXRhJyk7XG52YXIgZ2V0SW5kZXggPSByZXF1aXJlKCcuL3V0aWxpdGllcy9nZXRJbmRleCcpO1xuXG5cbnZhciBpbml0QXBwID0gZnVuY3Rpb24oKSB7IC8vZGVidWdnZXI7XG4gIC8vIEZyYW1ld29yayBpbml0XG4gIHZhciBmcmFtZXdvcmsgPSBuZXcgRnJhbWV3b3JrKCk7XG4gIGZyYW1ld29yay5nZXRFbGVtZW50cygpO1xuICBmcmFtZXdvcmsuaW5pdEV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgQXBwLmZyYW1ld29yayA9IGZyYW1ld29yaztcbiAgXG4gIC8vIFNwZWN0cnVtIGluaXRcbiAgdmFyIHAgPSBnZXRTcGVjdHJ1bVBhcmFtcygpOyBcbiAgXG4gIERlYnVnKHApO1xuXG4gIHZhciBzMSA9IG5ldyBTcGVjdHJ1bSgnczEnLCBwLmNvbG9yc1swXSwgcC5zaXplWzBdLCBwLnRoaWNrbmVzc1swXSwgcC5ib3VuY2VbMF0sIHAubW9ycGhbMF0pOyBcbiAgdmFyIHMyID0gbmV3IFNwZWN0cnVtKCdzMicsIHAuY29sb3JzWzFdLCBwLnNpemVbMV0sIHAudGhpY2tuZXNzWzFdLCBwLmJvdW5jZVsxXSwgcC5tb3JwaFsxXSk7IFxuICB2YXIgczMgPSBuZXcgU3BlY3RydW0oJ3MzJywgcC5jb2xvcnNbMl0sIHAuc2l6ZVsyXSwgcC50aGlja25lc3NbMl0sIHAuYm91bmNlWzJdLCBwLm1vcnBoWzJdKTsgXG4gIFxuICBBcHAuc3BlY3RydW1zLnB1c2goczEpO1xuICBBcHAuc3BlY3RydW1zLnB1c2goczIpO1xuICBBcHAuc3BlY3RydW1zLnB1c2goczMpO1xuXG4gIC8vIFNvbmcgaW5pdFxuICBBcHAuc29uZyA9IG5ldyBTb25nKCk7XG4gIFxuICAvLyBwdXQgdGhpcyBhcHAgb2JqZWN0IGludG8gdGhlIGdsb2JhbCB3aW5kb3dcbiAgd2luZG93LnRoaXNBcHAgPSBBcHA7XG4gIFxuICAvLyBQNSBza2V0Y2hcbiAgdmFyIG1vYWlQNSA9IG5ldyBwNShTa2V0Y2gsICdsYXllcjEnKTtcbn07XG5cblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICBpbml0QXBwKCk7XG59O1xuXG5cbnZhciBnZXRTcGVjdHJ1bVBhcmFtcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaSA9IGdldEluZGV4KCk7XG5cbiAgdmFyIGR5bmFtaWNTcGVjdHJ1bUhlaWdodHMgPSAgZGF0YVtpXS5zaXplXG4gICAgLm1hcChmdW5jdGlvbihyYXRpbykge1xuICAgICAgcmV0dXJuIHJhdGlvICogIE1hdGgubWluKHdpbmRvdy5pbm5lckhlaWdodCwgd2luZG93LmlubmVyV2lkdGgpO1xuICAgIH0pO1xuICBcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBkYXRhW2ldLm5hbWUsXG4gICAgY29sb3JzOiBkYXRhW2ldLnNwZWN0cnVtQ29sb3JzLFxuICAgIHNpemU6IGR5bmFtaWNTcGVjdHJ1bUhlaWdodHMsXG4gICAgdGhpY2tuZXNzOiBkYXRhW2ldLnRoaWNrbmVzcyxcbiAgICBib3VuY2U6IGRhdGFbaV0uYm91bmNlLFxuICAgIG1vcnBoOiBkYXRhW2ldLm1vcnBoXG4gIH1cbn07IiwiJ3VzZS1zdHJpY3QnO1xuXG5yZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcbnZhciBBcHAgPSByZXF1aXJlKCcuL2FwcCcpO1xudmFyIFNvbmcgPSByZXF1aXJlKCcuL3NvbmcnKTtcbnZhciBEZWJ1ZyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2RlYnVnJyk7XG52YXIgZ2V0SW5kZXggPSByZXF1aXJlKCcuL3V0aWxpdGllcy9nZXRJbmRleCcpO1xuXG5cbnZhciBzID0gZnVuY3Rpb24oc2tldGNoKSB7IC8vZGVidWdnZXI7XG4gIHZhciBsb2FkZWQgPSBmYWxzZTtcbiAgd2luZG93Lmdsb2JhbFA1ID0gc2tldGNoOyAvLyBnbG9iYWwgY29weSBvZiBwNVxuXG4gIHNrZXRjaC5wcmVsb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluZGV4ID0gZ2V0SW5kZXgoKTtcbiAgICBjb25zb2xlLmxvZygncHJvY2Vzcy5lbnYuRU5WJywgcHJvY2Vzcy5lbnYuRU5WKTtcbiAgICB2YXIgcGF0aCA9IHByb2Nlc3MuZW52LkVOViA9PT0gJ3Byb2R1Y3Rpb24nID8gJy9kaXN0JyA6ICcvcHVibGljJztcbiAgICB2YXIgdXJsID0gcGF0aCArICcvYXVkaW8vJyArIGluZGV4ICsgJy5tcDMnO1xuICAgIHdpbmRvdy50aGlzQXBwLnNvbmcuc291bmQgPSBnbG9iYWxQNS5sb2FkU291bmQodXJsKTtcbiAgfTtcblxuICBza2V0Y2guc2V0dXAgPSBmdW5jdGlvbigpIHtcbiAgICBza2V0Y2guY3JlYXRlQ2FudmFzKHNrZXRjaC53aW5kb3dXaWR0aCwgc2tldGNoLndpbmRvd0hlaWdodCk7ICBcbiAgICBza2V0Y2guZnJhbWVSYXRlKDIwKTtcbiAgICB3aW5kb3cudGhpc0FwcC5zb25nLnBsYXkoKTtcbiAgfTtcbiAgXG4gIHNrZXRjaC5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYoIWxvYWRlZCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xheWVyMScpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICBpZih0eXBlb2Ygd2luZG93LnRoaXNBcHAgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBza2V0Y2guY2xlYXIoKTtcbiAgICAgIHNrZXRjaC5iYWNrZ3JvdW5kKCdyZ2JhKDI1NSwgMjU1LCAyNTUsIDApJyk7XG4gICAgXG4gICAgICB3aW5kb3cudGhpc0FwcC5zb25nLnNldFdhdmVmb3JtKCk7XG4gICAgXG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgQXBwLnNwZWN0cnVtcy5sZW5ndGg7IGorKykge1xuICAgICAgICB3aW5kb3cudGhpc0FwcC5zcGVjdHJ1bXNbal0uZHJhdyhza2V0Y2gpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gczsiLCJ2YXIgU29uZyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnRpbWVEYXRhID0gW107XG4gIHRoaXMuc29uZ0lkID0gdGhpcy5nZXRTb25nSWRfKCk7XG4gIHRoaXMuc291bmQ7IC8qPSB0aGlzLmxvYWRTb3VuZF8oKTsqL1xuICB0aGlzLmR1cmF0aW9uIC8qPSB0aGlzLmdldFNvbmdEdXJhdGlvbl8oKTsqL1xuICB0aGlzLmJwbSA9IHRoaXMuZ2V0QlBNKCk7XG4gIHRoaXMuZmZ0ID0gdGhpcy5nZXRGRlRfKCk7XG4gIHRoaXMud2F2ZWZvcm0gPSB0aGlzLmZmdC53YXZlZm9ybSgpO1xuICB0aGlzLnNwZWN0cnVtID0gdGhpcy5mZnQuYW5hbHl6ZSgpO1xuICB0aGlzLmJhc3NFbmVyZ3kgPSB0aGlzLmZmdC5nZXRFbmVyZ3koJ2Jhc3MnKTtcbiAgdGhpcy5taWRFbmVyZ3kgPSB0aGlzLmZmdC5nZXRFbmVyZ3koJ21pZCcpO1xuICB0aGlzLmhpZ2hFbmVyZ3kgPSB0aGlzLmZmdC5nZXRFbmVyZ3koJ3RyZWJsZScpO1xuICB0aGlzLmdldFRpbWVDYWxjdWxhdGlvbnNfKCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRTb25nSWRfID0gZnVuY3Rpb24oKSB7XG4gIGlmKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gJ2luZGV4JztcbiAgfSBlbHNlIHtcbiAgICAvLyA2ID0gL3NvbmcvXG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zbGljZSg2LCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubGVuZ3RoKTtcbiAgfVxufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0QlBNID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAxMjA7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5sb2FkU291bmRfID0gZnVuY3Rpb24obW9haVA1KSB7IC8vZGVidWdnZXI7XG4gIC8vIHZhciB1cmwgPSAnL3B1YmxpYy9hdWRpby8nKyB0aGlzLnNvbmdJZCArJy5tcDMnO1xuICAvLyByZXR1cm4gZ2xvYmFsUDUubG9hZFNvdW5kKHVybCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRTb25nRHVyYXRpb25fID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnNvdW5kLmR1cmF0aW9uKCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc291bmQucGxheSgpO1xufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0RkZUXyA9IGZ1bmN0aW9uKG1vYWlQNSkge1xuICByZXR1cm4gbmV3IHdpbmRvdy5wNS5GRlQ7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRXYXZlZm9ybSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy53YXZlZm9ybTtcbn07XG5cblNvbmcucHJvdG90eXBlLnNldFdhdmVmb3JtID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMud2F2ZWZvcm0gPSB0aGlzLmZmdC53YXZlZm9ybSgpO1xufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0U3BlY3RyYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc3BlY3RydW07XG59O1xuXG5Tb25nLnByb3RvdHlwZS5zZXRTcGVjdHJhbCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwZWN0cnVtID0gdGhpcy5mZnQuYW5hbHl6ZSgpO1xufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0RW5lcmd5XyA9IGZ1bmN0aW9uKGZyZXF1ZW5jeVJhbmdlKSB7XG4gIHJldHVybiB0aGlzLmZmdC5nZXRFbmVyZ3koZnJlcXVlbmN5UmFuZ2UpO1xufTtcblxuU29uZy5wcm90b3R5cGUudm9sdW1lT24gPSBmdW5jdGlvbihtb2FpUDUpIHtcbiAgd2luZG93LnA1Lm1hc3RlclZvbHVtZSgxKTtcbn07XG5cblNvbmcucHJvdG90eXBlLnZvbHVtZU9mZiA9IGZ1bmN0aW9uKG1vYWlQNSkge1xuICB3aW5kb3cucDUubWFzdGVyVm9sdW1lKDApO1xufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0VGltZUNhbGN1bGF0aW9uc18gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmFzZSA9IDI0MDAwMCAvIHRoaXMuYnBtO1xuXG4gICAgZm9yKHZhciBpID0gMTsgaSA8PSAxNjsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gaS50b1N0cmluZygpO1xuICAgICAgdmFyIHZhbHVlID0gYmFzZSAvIGk7XG4gICAgICB0aGlzLnRpbWVEYXRhLnB1c2goeyBrZXk6IHZhbHVlIH0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU29uZzsiLCJ2YXIgU3BlY3RydW0gPSBmdW5jdGlvbihuYW1lLCBjb2xvciwgc2l6ZSwgdGhpY2tuZXNzLCBib3VuY2UsIG1vcnBoKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgdGhpcy5zaXplID0gc2l6ZTtcbiAgdGhpcy50aGlja25lc3MgPSB0aGlja25lc3M7XG4gIHRoaXMuYm91bmNlID0gYm91bmNlO1xuICB0aGlzLm1vcnBoID0gbW9ycGg7XG4gIHRoaXMud2F2ZWZvcm0gPSBbXTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5zZXRDb2xvcl8gPSBmdW5jdGlvbihuZXdDb2xvcikge1xuICB0aGlzLmNvbG9yID0gbmV3Q29sb3I7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUuc2V0U2l6ZV8gPSBmdW5jdGlvbihuZXdTaXplKSB7XG4gICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5zZXRUaGlja25lc3NfID0gZnVuY3Rpb24obmV3VGhpY2tuZXNzKSB7XG4gIHRoaXMudGhpY2tuZXNzID0gbmV3VGhpY2tuZXNzO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLnNldEJvdW5jZV8gPSBmdW5jdGlvbihuZXdCb3VuY2UpIHtcbiAgdGhpcy5ib3VuY2UgPSBuZXdCb3VuY2U7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUuc2V0TW9ycGhfID0gZnVuY3Rpb24obmV3TW9ycGgpIHtcbiAgdGhpcy5tb3JwaCA9IG5ld01vcnBoO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmFkZFRvR3JvdXBfID0gZnVuY3Rpb24oKSB7XG4gIHNwZWN0cnVtcy5wdXNoKHRoaXMpO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmRyYXcgPSAgZnVuY3Rpb24oc2tldGNoKSB7XG4gIHNrZXRjaC5ub0ZpbGwoKTtcbiAgc2tldGNoLnN0cm9rZSh0aGlzLmNvbG9yKTtcbiAgc2tldGNoLnN0cm9rZVdlaWdodCh0aGlzLnRoaWNrbmVzcyk7XG4gIHNrZXRjaC5iZWdpblNoYXBlKCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzNjA7IGkrKyl7XG5cbiAgICB2YXIgd2F2ZSA9IHRoaXMuZ2V0RHluYW1pY0xlbmd0aF8oaSwgc2tldGNoKTtcblxuICAgIHZhciB4MSA9IHRoaXMuZ2V0Q2lyY3VsYXJYXyhpLCBza2V0Y2gpO1xuICAgIHZhciB5MSA9IHRoaXMuZ2V0Q2lyY3VsYXJZXyhpLCBza2V0Y2gpO1xuXG4gICAgdmFyIHhfd2F2ZSA9IHRoaXMucGl0Y2hYXyh3YXZlLCBpKTtcbiAgICB2YXIgeV93YXZlID0gdGhpcy5waXRjaFlfKHdhdmUsIGkpO1xuXG4gICAgdmFyIHgyID0geDEgKyB4X3dhdmU7XG4gICAgdmFyIHkyID0geTEgKyB5X3dhdmU7XG5cbiAgICBza2V0Y2guY3VydmVWZXJ0ZXgoeDIsIHkyKTtcbiAgfVxuICBza2V0Y2guZW5kU2hhcGUoKTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5nZXREeW5hbWljTGVuZ3RoXyA9IGZ1bmN0aW9uKGksIHNrZXRjaCkge1xuICB2YXIgd2F2ZWZvcm0gPSB3aW5kb3cudGhpc0FwcC5zb25nLmdldFdhdmVmb3JtKCk7XG4gIC8vIHJldHVybiBza2V0Y2gubWFwKHdhdmVmb3JtW2kgKiB0aGlzLm1vcnBoXSAvIHRoaXMuYm91bmNlLCAtMSwgMSwgMCwgMTUwKTtcbiAgcmV0dXJuIHNrZXRjaC5tYXAod2F2ZWZvcm1baSAqIHRoaXMubW9ycGhdIC8gdGhpcy5ib3VuY2UsIC0xLCAxLCAwLCAxNTApO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmdldENpcmN1bGFyWF8gPSBmdW5jdGlvbihpLCBza2V0Y2gpIHtcbiAgcmV0dXJuICh0aGlzLnNpemUgKiBNYXRoLnNpbihpICogdGhpcy5tb3JwaCkgKyBza2V0Y2gud2lkdGggLyAyKTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5nZXRDaXJjdWxhcllfID0gZnVuY3Rpb24oaSwgc2tldGNoKSB7XG4gIHJldHVybiAodGhpcy5zaXplICogTWF0aC5jb3MoaSAqIHRoaXMubW9ycGgpICsgc2tldGNoLmhlaWdodCAvIDIpO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLnBpdGNoWF8gPSBmdW5jdGlvbih3YXZlLCBpKSB7XG4gIHJldHVybiB3YXZlICogTWF0aC5zaW4oaSk7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUucGl0Y2hZXyA9IGZ1bmN0aW9uKHdhdmUsIGkpIHtcbiAgcmV0dXJuIHdhdmUgKiBNYXRoLmNvcyhpKTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5jaGFuZ2VDb2xvcl8gPSBmdW5jdGlvbigpIHt9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU3BlY3RydW07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5cbnZhciBEZWJ1ZyA9IGZ1bmN0aW9uKC8qIGFyZ3VtZW50cyAqLykgeyAvL2RlYnVnZ2VyO1xuICBpZihwcm9jZXNzLmVudi5FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICB2YXIgcHJpbnRzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICBcbiAgICBwcmludHMubWFwKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIGlmKHR5cGVvZiBhcmd1bWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBwcmludCA9IHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyBcbiAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KGl0ZW0pIFxuICAgICAgICAgIDogaXRlbVxuICAgICAgICBcbiAgICAgICAgICBjb25zb2xlLmxvZyhpLCBwcmludCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZWJ1ZzsiLCJ2YXIgZ2V0SW5kZXggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5sZW5ndGggPT09IDEgXG4gICAgPyAnaW5kZXgnXG4gICAgOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc2xpY2UoNiwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmxlbmd0aCk7IC8vIG51bSAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEluZGV4OyJdfQ==
