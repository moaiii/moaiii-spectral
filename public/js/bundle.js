(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [
  {
    name: 'index',
    bpm: 120,
    gradientColors: ['#fdbb2d', '#22c1c3'],
    spectrumColors: ['#EAEAEA', '#DBDBDB', '#F2F2F2'],
    size: [0.5, 0.4, 0.3],
    thickness: [1, 0.75, 0.5],
    bounce: [0.25, 0.5, 1],
    morph: [1, 4, 7],
    soundcloudUrl: 'https://soundcloud.com/moai_music/intro'
  }, 
  {
    name: 'rojo',
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
    name: 'vovka',
    bpm: 120,
    gradientColors: ['#2657eb', '#de6161'],
    spectrumColors: ['#EAEAEA', '#DBDBDB', '#F2F2F2'],
    size: [0.35, 0.15, 0.27], // max 0.3
    thickness: [1, 0.75, 0.5],
    bounce: [2, 0.5, 1],
    morph: [20, 5, 1],
    soundcloudUrl: 'https://soundcloud.com/moai_music/vovka'
  }, 
  {
    name: 'lisboa',
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

},{}],2:[function(require,module,exports){
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

},{"_process":10}],3:[function(require,module,exports){
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
  this.getElements();
  this.initEventListeners();
  
  window.count = 0;
  window.menuIsOpen = false;
  
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
};


Framework.prototype.initEventListeners = function() {
  if(this.menuOpen !== null){
    this.menuOpen.addEventListener("click", function() {
      this.toggleMenu_(true);
    }.bind(this));
  
    this.menuClose.addEventListener("click", function() {
      this.toggleMenu_(false);
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


module.exports = Framework;
},{}],4:[function(require,module,exports){
'use-strict';

var App = require('./app');
var Framework = require('./framework');
var Spectrum = require('./spectrum');
var Sketch = require('./sketch');
var Debug = require('./utilities/debug');
var Song = require('./song');
var data = require('../../data/songs');
var getIndex = require('./utilities/getIndex');


var initApp = function() { //debugger;
  // Framework init
  var framework = new Framework();
  framework.getElements();
  framework.initEventListeners();

  App.framework = framework;
  
  // Spectrum init
  var p = getSpectrumParams(); console.log('p', p)

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
},{"../../data/songs":1,"./app":2,"./framework":3,"./sketch":5,"./song":6,"./spectrum":7,"./utilities/debug":8,"./utilities/getIndex":9}],5:[function(require,module,exports){
'use-strict';

var App = require('./app');
var Song = require('./song');
var Debug = require('./utilities/debug');
var getIndex = require('./utilities/getIndex');

var s = function(sketch) { //debugger;
  var loaded = false;
  window.globalP5 = sketch; // global copy of p5

  sketch.preload = function() {
    var index = getIndex();

    var url = '/public/audio/' + index + '.mp3';
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
},{"./app":2,"./song":6,"./utilities/debug":8,"./utilities/getIndex":9}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
'use strict';

var App = require('../app');

var Debug = function(/* arguments */) { //debugger;
  if(App.debug) {
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
},{"../app":2}],9:[function(require,module,exports){
var getIndex = function() {
  return window.location.pathname.length === 1 
    ? 'index'
    : window.location.pathname.slice(6, window.location.pathname.length); // num  
};

module.exports = getIndex;
},{}],10:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvZGF0YS9zb25ncy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2FwcC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2ZyYW1ld29yay5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2luaXQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9za2V0Y2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9zb25nLmpzIiwicHVibGljL2pzL21vZHVsZXMvc3BlY3RydW0uanMiLCJwdWJsaWMvanMvbW9kdWxlcy91dGlsaXRpZXMvZGVidWcuanMiLCJwdWJsaWMvanMvbW9kdWxlcy91dGlsaXRpZXMvZ2V0SW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAge1xuICAgIG5hbWU6ICdpbmRleCcsXG4gICAgYnBtOiAxMjAsXG4gICAgZ3JhZGllbnRDb2xvcnM6IFsnI2ZkYmIyZCcsICcjMjJjMWMzJ10sXG4gICAgc3BlY3RydW1Db2xvcnM6IFsnI0VBRUFFQScsICcjREJEQkRCJywgJyNGMkYyRjInXSxcbiAgICBzaXplOiBbMC41LCAwLjQsIDAuM10sXG4gICAgdGhpY2tuZXNzOiBbMSwgMC43NSwgMC41XSxcbiAgICBib3VuY2U6IFswLjI1LCAwLjUsIDFdLFxuICAgIG1vcnBoOiBbMSwgNCwgN10sXG4gICAgc291bmRjbG91ZFVybDogJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vbW9haV9tdXNpYy9pbnRybydcbiAgfSwgXG4gIHtcbiAgICBuYW1lOiAncm9qbycsXG4gICAgYnBtOiAxMjAsXG4gICAgZ3JhZGllbnRDb2xvcnM6IFsnI2ZmNmEwMCcsICcjZWUwOTc5J10sICAgIFxuICAgIHNwZWN0cnVtQ29sb3JzOiBbJyNFQUVBRUEnLCAnI0RCREJEQicsICcjRjJGMkYyJ10sXG4gICAgc2l6ZTogWzAuMywgMC4xNSwgMC4wNl0sIC8vIG1heCAwLjNcbiAgICB0aGlja25lc3M6IFsxLCAwLjc1LCAwLjVdLFxuICAgIGJvdW5jZTogWzEsIDAuOCwgMC43XSxcbiAgICBtb3JwaDogWzUsIDIwLCAxXSxcbiAgICBzb3VuZGNsb3VkVXJsOiAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9tb2FpX211c2ljL3Jvam8nXG4gIH0sIFxuICB7XG4gICAgbmFtZTogJ3ZvdmthJyxcbiAgICBicG06IDEyMCxcbiAgICBncmFkaWVudENvbG9yczogWycjMjY1N2ViJywgJyNkZTYxNjEnXSxcbiAgICBzcGVjdHJ1bUNvbG9yczogWycjRUFFQUVBJywgJyNEQkRCREInLCAnI0YyRjJGMiddLFxuICAgIHNpemU6IFswLjM1LCAwLjE1LCAwLjI3XSwgLy8gbWF4IDAuM1xuICAgIHRoaWNrbmVzczogWzEsIDAuNzUsIDAuNV0sXG4gICAgYm91bmNlOiBbMiwgMC41LCAxXSxcbiAgICBtb3JwaDogWzIwLCA1LCAxXSxcbiAgICBzb3VuZGNsb3VkVXJsOiAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9tb2FpX211c2ljL3ZvdmthJ1xuICB9LCBcbiAge1xuICAgIG5hbWU6ICdsaXNib2EnLFxuICAgIGJwbTogMTIwLFxuICAgIGdyYWRpZW50Q29sb3JzOiBbJyNmZGJiMmQnLCAnIzIyYzFjMyddLCAgICBcbiAgICBzcGVjdHJ1bUNvbG9yczogWycjRUFFQUVBJywgJyNEQkRCREInLCAnI0YyRjJGMiddLFxuICAgIHNpemU6IFswLjMsIDAuMiwgMC4wNV0sXG4gICAgdGhpY2tuZXNzOiBbMSwgMC43NSwgMC41XSxcbiAgICBib3VuY2U6IFsxLCAwLjgsIDAuN10sXG4gICAgbW9ycGg6IFsxNywgMjAsIDFdLFxuICAgIHNvdW5kY2xvdWRVcmw6ICdodHRwczovL3NvdW5kY2xvdWQuY29tL21vYWlfbXVzaWMvbGlzYm9hJ1xuICB9XG5dO1xuXG4vLyBiYWNrZ3JvdW5kOiNkZTYxNjE7YmFja2dyb3VuZDotd2Via2l0LWxpbmVhci1ncmFkaWVudCh0byByaWdodCwjMjY1N2ViLCNkZTYxNjEpO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCMyNjU3ZWIsI2RlNjE2MSk7XG4iLCIndXNlLXN0cmljdCc7XG5cbi8vIGNvbnN0IGFyZ3YgPSByZXF1aXJlKCd5YXJncycpLmFyZ3ZcblxudmFyIEFwcCA9IHtcbiAgZGVidWc6IHByb2Nlc3MuZW52LkRFQlVHID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UsXG4gIHNwZWN0cnVtczogW10sXG4gIHNvbmc6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwOyIsIid1c2Utc3RyaWN0JztcblxudmFyIEZyYW1ld29yayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1lbnVPcGVuID0gbnVsbDtcbiAgdGhpcy5tZW51Q2xvc2UgPSBudWxsO1xuICB0aGlzLnZvbHVtZU9uID0gbnVsbDtcbiAgdGhpcy52b2x1bWVPZmYgPSBudWxsO1xuICB0aGlzLm1lbnVQYWdlID0gbnVsbDtcbiAgdGhpcy5tZW51Q29udGVudCA9IG51bGw7XG4gIHRoaXMubmF2UHJldmlvdXMgPSBudWxsO1xuICB0aGlzLm5hdk5leHQgPSBudWxsO1xuICB0aGlzLmZyYW1ld29yayA9IG51bGw7XG4gIHRoaXMuZ2V0RWxlbWVudHMoKTtcbiAgdGhpcy5pbml0RXZlbnRMaXN0ZW5lcnMoKTtcbiAgXG4gIHdpbmRvdy5jb3VudCA9IDA7XG4gIHdpbmRvdy5tZW51SXNPcGVuID0gZmFsc2U7XG4gIFxuICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBpZih3aW5kb3cuY291bnQgPiA1ICYmICF3aW5kb3cubWVudUlzT3Blbikge1xuICAgICAgdGhpcy5mcmFtZXdvcmsuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgIH1cblxuICAgIHdpbmRvdy5jb3VudCArPSAxO1xuICB9LCAxMDAwKTtcbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1lbnVPcGVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtb3BlbicpO1xuICB0aGlzLm1lbnVDbG9zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNsb3NlZCcpO1xuICB0aGlzLnZvbHVtZU9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZvbHVtZS1vbicpO1xuICB0aGlzLnZvbHVtZU9mZiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2b2x1bWUtb2ZmJyk7XG4gIHRoaXMubWVudVBhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1wYWdlJyk7XG4gIHRoaXMubWVudUNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jb250ZW50Jyk7XG4gIHRoaXMubmF2UHJldmlvdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXByZXZpb3VzJyk7XG4gIHRoaXMubmF2TmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbmV4dCcpO1xuICB0aGlzLmZyYW1ld29yayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcmFtZXdvcmsnKTtcbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS5pbml0RXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgaWYodGhpcy5tZW51T3BlbiAhPT0gbnVsbCl7XG4gICAgdGhpcy5tZW51T3Blbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRvZ2dsZU1lbnVfKHRydWUpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIFxuICAgIHRoaXMubWVudUNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudG9nZ2xlTWVudV8oZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIFxuICAgIHRoaXMudm9sdW1lT24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50b2dnbGVWb2x1bWVfKGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICBcbiAgICB0aGlzLnZvbHVtZU9mZi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRvZ2dsZVZvbHVtZV8odHJ1ZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuZnJhbWV3b3JrLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgdGhpcy5yZXNldENvdW50ZXIoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG59O1xuXG5GcmFtZXdvcmsucHJvdG90eXBlLnJlc2V0Q291bnRlciA9IGZ1bmN0aW9uKCkge1xuICB3aW5kb3cuY291bnQgPSAwO1xuICB0aGlzLmZyYW1ld29yay5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG59O1xuXG5cbkZyYW1ld29yay5wcm90b3R5cGUudG9nZ2xlTWVudV8gPSBmdW5jdGlvbihvcGVuKSB7XG4gIGlmKG9wZW4pIHsgXG4gICAgdGhpcy5tZW51UGFnZS5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5Jyk7XG4gICAgdGhpcy5tZW51Q29udGVudC5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5Jyk7XG4gICAgdGhpcy5tZW51T3Blbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB0aGlzLm1lbnVDbG9zZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB3aW5kb3cubWVudUlzT3BlbiA9IHRydWU7ICAgIFxuXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZW51UGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5Jyk7XG4gICAgdGhpcy5tZW51Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5Jyk7XG4gICAgdGhpcy5tZW51T3Blbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB0aGlzLm1lbnVDbG9zZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB3aW5kb3cubWVudUlzT3BlbiA9IGZhbHNlO1xuICAgIFxuICB9XG59O1xuXG5cbkZyYW1ld29yay5wcm90b3R5cGUudG9nZ2xlVm9sdW1lXyA9IGZ1bmN0aW9uKG9uKSB7XG4gIGlmKG9uKSB7XG4gICAgd2luZG93Lmdsb2JhbFA1Lm1hc3RlclZvbHVtZSA9IDE7XG4gICAgdGhpcy52b2x1bWVPbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB0aGlzLnZvbHVtZU9mZi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICBcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuZ2xvYmFsUDUubWFzdGVyVm9sdW1lID0gMDtcbiAgICB0aGlzLnZvbHVtZU9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHRoaXMudm9sdW1lT2ZmLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWV3b3JrOyIsIid1c2Utc3RyaWN0JztcblxudmFyIEFwcCA9IHJlcXVpcmUoJy4vYXBwJyk7XG52YXIgRnJhbWV3b3JrID0gcmVxdWlyZSgnLi9mcmFtZXdvcmsnKTtcbnZhciBTcGVjdHJ1bSA9IHJlcXVpcmUoJy4vc3BlY3RydW0nKTtcbnZhciBTa2V0Y2ggPSByZXF1aXJlKCcuL3NrZXRjaCcpO1xudmFyIERlYnVnID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZGVidWcnKTtcbnZhciBTb25nID0gcmVxdWlyZSgnLi9zb25nJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvc29uZ3MnKTtcbnZhciBnZXRJbmRleCA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2dldEluZGV4Jyk7XG5cblxudmFyIGluaXRBcHAgPSBmdW5jdGlvbigpIHsgLy9kZWJ1Z2dlcjtcbiAgLy8gRnJhbWV3b3JrIGluaXRcbiAgdmFyIGZyYW1ld29yayA9IG5ldyBGcmFtZXdvcmsoKTtcbiAgZnJhbWV3b3JrLmdldEVsZW1lbnRzKCk7XG4gIGZyYW1ld29yay5pbml0RXZlbnRMaXN0ZW5lcnMoKTtcblxuICBBcHAuZnJhbWV3b3JrID0gZnJhbWV3b3JrO1xuICBcbiAgLy8gU3BlY3RydW0gaW5pdFxuICB2YXIgcCA9IGdldFNwZWN0cnVtUGFyYW1zKCk7IGNvbnNvbGUubG9nKCdwJywgcClcblxuICB2YXIgczEgPSBuZXcgU3BlY3RydW0oJ3MxJywgcC5jb2xvcnNbMF0sIHAuc2l6ZVswXSwgcC50aGlja25lc3NbMF0sIHAuYm91bmNlWzBdLCBwLm1vcnBoWzBdKTsgXG4gIHZhciBzMiA9IG5ldyBTcGVjdHJ1bSgnczInLCBwLmNvbG9yc1sxXSwgcC5zaXplWzFdLCBwLnRoaWNrbmVzc1sxXSwgcC5ib3VuY2VbMV0sIHAubW9ycGhbMV0pOyBcbiAgdmFyIHMzID0gbmV3IFNwZWN0cnVtKCdzMycsIHAuY29sb3JzWzJdLCBwLnNpemVbMl0sIHAudGhpY2tuZXNzWzJdLCBwLmJvdW5jZVsyXSwgcC5tb3JwaFsyXSk7IFxuICBcbiAgQXBwLnNwZWN0cnVtcy5wdXNoKHMxKTtcbiAgQXBwLnNwZWN0cnVtcy5wdXNoKHMyKTtcbiAgQXBwLnNwZWN0cnVtcy5wdXNoKHMzKTtcblxuICAvLyBTb25nIGluaXRcbiAgQXBwLnNvbmcgPSBuZXcgU29uZygpO1xuICBcbiAgLy8gcHV0IHRoaXMgYXBwIG9iamVjdCBpbnRvIHRoZSBnbG9iYWwgd2luZG93XG4gIHdpbmRvdy50aGlzQXBwID0gQXBwO1xuICBcbiAgLy8gUDUgc2tldGNoXG4gIHZhciBtb2FpUDUgPSBuZXcgcDUoU2tldGNoLCAnbGF5ZXIxJyk7XG59O1xuXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgaW5pdEFwcCgpO1xufTtcblxuXG52YXIgZ2V0U3BlY3RydW1QYXJhbXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGkgPSBnZXRJbmRleCgpO1xuXG4gIHZhciBkeW5hbWljU3BlY3RydW1IZWlnaHRzID0gIGRhdGFbaV0uc2l6ZVxuICAgIC5tYXAoZnVuY3Rpb24ocmF0aW8pIHtcbiAgICAgIHJldHVybiByYXRpbyAqICBNYXRoLm1pbih3aW5kb3cuaW5uZXJIZWlnaHQsIHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICB9KTtcbiAgXG4gIHJldHVybiB7XG4gICAgbmFtZTogZGF0YVtpXS5uYW1lLFxuICAgIGNvbG9yczogZGF0YVtpXS5zcGVjdHJ1bUNvbG9ycyxcbiAgICBzaXplOiBkeW5hbWljU3BlY3RydW1IZWlnaHRzLFxuICAgIHRoaWNrbmVzczogZGF0YVtpXS50aGlja25lc3MsXG4gICAgYm91bmNlOiBkYXRhW2ldLmJvdW5jZSxcbiAgICBtb3JwaDogZGF0YVtpXS5tb3JwaFxuICB9XG59OyIsIid1c2Utc3RyaWN0JztcblxudmFyIEFwcCA9IHJlcXVpcmUoJy4vYXBwJyk7XG52YXIgU29uZyA9IHJlcXVpcmUoJy4vc29uZycpO1xudmFyIERlYnVnID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZGVidWcnKTtcbnZhciBnZXRJbmRleCA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2dldEluZGV4Jyk7XG5cbnZhciBzID0gZnVuY3Rpb24oc2tldGNoKSB7IC8vZGVidWdnZXI7XG4gIHZhciBsb2FkZWQgPSBmYWxzZTtcbiAgd2luZG93Lmdsb2JhbFA1ID0gc2tldGNoOyAvLyBnbG9iYWwgY29weSBvZiBwNVxuXG4gIHNrZXRjaC5wcmVsb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluZGV4ID0gZ2V0SW5kZXgoKTtcblxuICAgIHZhciB1cmwgPSAnL3B1YmxpYy9hdWRpby8nICsgaW5kZXggKyAnLm1wMyc7XG4gICAgd2luZG93LnRoaXNBcHAuc29uZy5zb3VuZCA9IGdsb2JhbFA1LmxvYWRTb3VuZCh1cmwpO1xuICB9O1xuXG4gIHNrZXRjaC5zZXR1cCA9IGZ1bmN0aW9uKCkge1xuICAgIHNrZXRjaC5jcmVhdGVDYW52YXMoc2tldGNoLndpbmRvd1dpZHRoLCBza2V0Y2gud2luZG93SGVpZ2h0KTsgIFxuICAgIHNrZXRjaC5mcmFtZVJhdGUoMjApO1xuICAgIHdpbmRvdy50aGlzQXBwLnNvbmcucGxheSgpO1xuICB9O1xuXG4gIHNrZXRjaC5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYoIWxvYWRlZCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xheWVyMScpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICBpZih0eXBlb2Ygd2luZG93LnRoaXNBcHAgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBza2V0Y2guY2xlYXIoKTtcbiAgICAgIHNrZXRjaC5iYWNrZ3JvdW5kKCdyZ2JhKDI1NSwgMjU1LCAyNTUsIDApJyk7XG4gICAgXG4gICAgICB3aW5kb3cudGhpc0FwcC5zb25nLnNldFdhdmVmb3JtKCk7XG4gICAgXG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgQXBwLnNwZWN0cnVtcy5sZW5ndGg7IGorKykge1xuICAgICAgICB3aW5kb3cudGhpc0FwcC5zcGVjdHJ1bXNbal0uZHJhdyhza2V0Y2gpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gczsiLCJ2YXIgU29uZyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnRpbWVEYXRhID0gW107XG4gIHRoaXMuc29uZ0lkID0gdGhpcy5nZXRTb25nSWRfKCk7XG4gIHRoaXMuc291bmQ7IC8qPSB0aGlzLmxvYWRTb3VuZF8oKTsqL1xuICB0aGlzLmR1cmF0aW9uIC8qPSB0aGlzLmdldFNvbmdEdXJhdGlvbl8oKTsqL1xuICB0aGlzLmJwbSA9IHRoaXMuZ2V0QlBNKCk7XG4gIHRoaXMuZmZ0ID0gdGhpcy5nZXRGRlRfKCk7XG4gIHRoaXMud2F2ZWZvcm0gPSB0aGlzLmZmdC53YXZlZm9ybSgpO1xuICB0aGlzLnNwZWN0cnVtID0gdGhpcy5mZnQuYW5hbHl6ZSgpO1xuICB0aGlzLmJhc3NFbmVyZ3kgPSB0aGlzLmZmdC5nZXRFbmVyZ3koJ2Jhc3MnKTtcbiAgdGhpcy5taWRFbmVyZ3kgPSB0aGlzLmZmdC5nZXRFbmVyZ3koJ21pZCcpO1xuICB0aGlzLmhpZ2hFbmVyZ3kgPSB0aGlzLmZmdC5nZXRFbmVyZ3koJ3RyZWJsZScpO1xuICB0aGlzLmdldFRpbWVDYWxjdWxhdGlvbnNfKCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRTb25nSWRfID0gZnVuY3Rpb24oKSB7XG4gIGlmKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gJ2luZGV4JztcbiAgfSBlbHNlIHtcbiAgICAvLyA2ID0gL3NvbmcvXG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zbGljZSg2LCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubGVuZ3RoKTtcbiAgfVxufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0QlBNID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAxMjA7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5sb2FkU291bmRfID0gZnVuY3Rpb24obW9haVA1KSB7IC8vZGVidWdnZXI7XG4gIC8vIHZhciB1cmwgPSAnL3B1YmxpYy9hdWRpby8nKyB0aGlzLnNvbmdJZCArJy5tcDMnO1xuICAvLyByZXR1cm4gZ2xvYmFsUDUubG9hZFNvdW5kKHVybCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRTb25nRHVyYXRpb25fID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnNvdW5kLmR1cmF0aW9uKCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc291bmQucGxheSgpO1xufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0RkZUXyA9IGZ1bmN0aW9uKG1vYWlQNSkge1xuICByZXR1cm4gbmV3IHdpbmRvdy5wNS5GRlQ7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRXYXZlZm9ybSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy53YXZlZm9ybTtcbn07XG5cblNvbmcucHJvdG90eXBlLnNldFdhdmVmb3JtID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMud2F2ZWZvcm0gPSB0aGlzLmZmdC53YXZlZm9ybSgpO1xufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0U3BlY3RyYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc3BlY3RydW07XG59O1xuXG5Tb25nLnByb3RvdHlwZS5zZXRTcGVjdHJhbCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwZWN0cnVtID0gdGhpcy5mZnQuYW5hbHl6ZSgpO1xufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0RW5lcmd5XyA9IGZ1bmN0aW9uKGZyZXF1ZW5jeVJhbmdlKSB7XG4gIHJldHVybiB0aGlzLmZmdC5nZXRFbmVyZ3koZnJlcXVlbmN5UmFuZ2UpO1xufTtcblxuU29uZy5wcm90b3R5cGUudm9sdW1lT24gPSBmdW5jdGlvbihtb2FpUDUpIHtcbiAgd2luZG93LnA1Lm1hc3RlclZvbHVtZSgxKTtcbn07XG5cblNvbmcucHJvdG90eXBlLnZvbHVtZU9mZiA9IGZ1bmN0aW9uKG1vYWlQNSkge1xuICB3aW5kb3cucDUubWFzdGVyVm9sdW1lKDApO1xufTtcblxuU29uZy5wcm90b3R5cGUuZ2V0VGltZUNhbGN1bGF0aW9uc18gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmFzZSA9IDI0MDAwMCAvIHRoaXMuYnBtO1xuXG4gICAgZm9yKHZhciBpID0gMTsgaSA8PSAxNjsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0gaS50b1N0cmluZygpO1xuICAgICAgdmFyIHZhbHVlID0gYmFzZSAvIGk7XG4gICAgICB0aGlzLnRpbWVEYXRhLnB1c2goeyBrZXk6IHZhbHVlIH0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU29uZzsiLCJ2YXIgU3BlY3RydW0gPSBmdW5jdGlvbihuYW1lLCBjb2xvciwgc2l6ZSwgdGhpY2tuZXNzLCBib3VuY2UsIG1vcnBoKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgdGhpcy5zaXplID0gc2l6ZTtcbiAgdGhpcy50aGlja25lc3MgPSB0aGlja25lc3M7XG4gIHRoaXMuYm91bmNlID0gYm91bmNlO1xuICB0aGlzLm1vcnBoID0gbW9ycGg7XG4gIHRoaXMud2F2ZWZvcm0gPSBbXTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5zZXRDb2xvcl8gPSBmdW5jdGlvbihuZXdDb2xvcikge1xuICB0aGlzLmNvbG9yID0gbmV3Q29sb3I7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUuc2V0U2l6ZV8gPSBmdW5jdGlvbihuZXdTaXplKSB7XG4gICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5zZXRUaGlja25lc3NfID0gZnVuY3Rpb24obmV3VGhpY2tuZXNzKSB7XG4gIHRoaXMudGhpY2tuZXNzID0gbmV3VGhpY2tuZXNzO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLnNldEJvdW5jZV8gPSBmdW5jdGlvbihuZXdCb3VuY2UpIHtcbiAgdGhpcy5ib3VuY2UgPSBuZXdCb3VuY2U7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUuc2V0TW9ycGhfID0gZnVuY3Rpb24obmV3TW9ycGgpIHtcbiAgdGhpcy5tb3JwaCA9IG5ld01vcnBoO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmFkZFRvR3JvdXBfID0gZnVuY3Rpb24oKSB7XG4gIHNwZWN0cnVtcy5wdXNoKHRoaXMpO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmRyYXcgPSAgZnVuY3Rpb24oc2tldGNoKSB7XG4gIHNrZXRjaC5ub0ZpbGwoKTtcbiAgc2tldGNoLnN0cm9rZSh0aGlzLmNvbG9yKTtcbiAgc2tldGNoLnN0cm9rZVdlaWdodCh0aGlzLnRoaWNrbmVzcyk7XG4gIHNrZXRjaC5iZWdpblNoYXBlKCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzNjA7IGkrKyl7XG5cbiAgICB2YXIgd2F2ZSA9IHRoaXMuZ2V0RHluYW1pY0xlbmd0aF8oaSwgc2tldGNoKTtcblxuICAgIHZhciB4MSA9IHRoaXMuZ2V0Q2lyY3VsYXJYXyhpLCBza2V0Y2gpO1xuICAgIHZhciB5MSA9IHRoaXMuZ2V0Q2lyY3VsYXJZXyhpLCBza2V0Y2gpO1xuXG4gICAgdmFyIHhfd2F2ZSA9IHRoaXMucGl0Y2hYXyh3YXZlLCBpKTtcbiAgICB2YXIgeV93YXZlID0gdGhpcy5waXRjaFlfKHdhdmUsIGkpO1xuXG4gICAgdmFyIHgyID0geDEgKyB4X3dhdmU7XG4gICAgdmFyIHkyID0geTEgKyB5X3dhdmU7XG5cbiAgICBza2V0Y2guY3VydmVWZXJ0ZXgoeDIsIHkyKTtcbiAgfVxuICBza2V0Y2guZW5kU2hhcGUoKTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5nZXREeW5hbWljTGVuZ3RoXyA9IGZ1bmN0aW9uKGksIHNrZXRjaCkge1xuICB2YXIgd2F2ZWZvcm0gPSB3aW5kb3cudGhpc0FwcC5zb25nLmdldFdhdmVmb3JtKCk7XG4gIC8vIHJldHVybiBza2V0Y2gubWFwKHdhdmVmb3JtW2kgKiB0aGlzLm1vcnBoXSAvIHRoaXMuYm91bmNlLCAtMSwgMSwgMCwgMTUwKTtcbiAgcmV0dXJuIHNrZXRjaC5tYXAod2F2ZWZvcm1baSAqIHRoaXMubW9ycGhdIC8gdGhpcy5ib3VuY2UsIC0xLCAxLCAwLCAxNTApO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmdldENpcmN1bGFyWF8gPSBmdW5jdGlvbihpLCBza2V0Y2gpIHtcbiAgcmV0dXJuICh0aGlzLnNpemUgKiBNYXRoLnNpbihpICogdGhpcy5tb3JwaCkgKyBza2V0Y2gud2lkdGggLyAyKTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5nZXRDaXJjdWxhcllfID0gZnVuY3Rpb24oaSwgc2tldGNoKSB7XG4gIHJldHVybiAodGhpcy5zaXplICogTWF0aC5jb3MoaSAqIHRoaXMubW9ycGgpICsgc2tldGNoLmhlaWdodCAvIDIpO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLnBpdGNoWF8gPSBmdW5jdGlvbih3YXZlLCBpKSB7XG4gIHJldHVybiB3YXZlICogTWF0aC5zaW4oaSk7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUucGl0Y2hZXyA9IGZ1bmN0aW9uKHdhdmUsIGkpIHtcbiAgcmV0dXJuIHdhdmUgKiBNYXRoLmNvcyhpKTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5jaGFuZ2VDb2xvcl8gPSBmdW5jdGlvbigpIHt9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU3BlY3RydW07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG5cbnZhciBEZWJ1ZyA9IGZ1bmN0aW9uKC8qIGFyZ3VtZW50cyAqLykgeyAvL2RlYnVnZ2VyO1xuICBpZihBcHAuZGVidWcpIHtcbiAgICB2YXIgcHJpbnRzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xuICBcbiAgICBwcmludHMubWFwKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIGlmKHR5cGVvZiBhcmd1bWVudHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBwcmludCA9IHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyBcbiAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KGl0ZW0pIFxuICAgICAgICAgIDogaXRlbVxuICAgICAgICBcbiAgICAgICAgICBjb25zb2xlLmxvZyhpLCBwcmludCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZWJ1ZzsiLCJ2YXIgZ2V0SW5kZXggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5sZW5ndGggPT09IDEgXG4gICAgPyAnaW5kZXgnXG4gICAgOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc2xpY2UoNiwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmxlbmd0aCk7IC8vIG51bSAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEluZGV4OyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
