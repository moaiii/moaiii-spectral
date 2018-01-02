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
  // (name, color, size, thickness, bounce, morph)
  var p = getSpectrumParams(); console.log('p', p)

  var s1 = new Spectrum('s1', p.colors[0], p.size[0], p.thickness[0], p.bounce[0], p.morph[0]); 
  App.spectrums.push(s1);

  var s2 = new Spectrum('s2', p.colors[1], p.size[1], p.thickness[1], p.bounce[1], p.morph[1]); 
  App.spectrums.push(s2);

  var s3 = new Spectrum('s3', p.colors[2], p.size[2], p.thickness[2], p.bounce[2], p.morph[2]); 
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvZGF0YS9zb25ncy5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2FwcC5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2ZyYW1ld29yay5qcyIsInB1YmxpYy9qcy9tb2R1bGVzL2luaXQuanMiLCJwdWJsaWMvanMvbW9kdWxlcy9za2V0Y2guanMiLCJwdWJsaWMvanMvbW9kdWxlcy9zb25nLmpzIiwicHVibGljL2pzL21vZHVsZXMvc3BlY3RydW0uanMiLCJwdWJsaWMvanMvbW9kdWxlcy91dGlsaXRpZXMvZGVidWcuanMiLCJwdWJsaWMvanMvbW9kdWxlcy91dGlsaXRpZXMvZ2V0SW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAge1xuICAgIG5hbWU6ICdpbmRleCcsXG4gICAgYnBtOiAxMjAsXG4gICAgZ3JhZGllbnRDb2xvcnM6IFsnI2ZkYmIyZCcsICcjMjJjMWMzJ10sXG4gICAgc3BlY3RydW1Db2xvcnM6IFsnI0VBRUFFQScsICcjREJEQkRCJywgJyNGMkYyRjInXSxcbiAgICBzaXplOiBbMC41LCAwLjQsIDAuM10sXG4gICAgdGhpY2tuZXNzOiBbMSwgMC43NSwgMC41XSxcbiAgICBib3VuY2U6IFswLjI1LCAwLjUsIDFdLFxuICAgIG1vcnBoOiBbMSwgNCwgN10sXG4gICAgc291bmRjbG91ZFVybDogJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vbW9haV9tdXNpYy9pbnRybydcbiAgfSwgXG4gIHtcbiAgICBuYW1lOiAncm9qbycsXG4gICAgYnBtOiAxMjAsXG4gICAgZ3JhZGllbnRDb2xvcnM6IFsnI2ZmNmEwMCcsICcjZWUwOTc5J10sICAgIFxuICAgIHNwZWN0cnVtQ29sb3JzOiBbJyNFQUVBRUEnLCAnI0RCREJEQicsICcjRjJGMkYyJ10sXG4gICAgc2l6ZTogWzAuMywgMC4xNSwgMC4wNl0sIC8vIG1heCAwLjNcbiAgICB0aGlja25lc3M6IFsxLCAwLjc1LCAwLjVdLFxuICAgIGJvdW5jZTogWzEsIDAuOCwgMC43XSxcbiAgICBtb3JwaDogWzUsIDIwLCAxXSxcbiAgICBzb3VuZGNsb3VkVXJsOiAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9tb2FpX211c2ljL3Jvam8nXG4gIH0sIFxuICB7XG4gICAgbmFtZTogJ3ZvdmthJyxcbiAgICBicG06IDEyMCxcbiAgICBncmFkaWVudENvbG9yczogWycjMjY1N2ViJywgJyNkZTYxNjEnXSxcbiAgICBzcGVjdHJ1bUNvbG9yczogWycjRUFFQUVBJywgJyNEQkRCREInLCAnI0YyRjJGMiddLFxuICAgIHNpemU6IFswLjM1LCAwLjE1LCAwLjI3XSwgLy8gbWF4IDAuM1xuICAgIHRoaWNrbmVzczogWzEsIDAuNzUsIDAuNV0sXG4gICAgYm91bmNlOiBbMiwgMC41LCAxXSxcbiAgICBtb3JwaDogWzIwLCA1LCAxXSxcbiAgICBzb3VuZGNsb3VkVXJsOiAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9tb2FpX211c2ljL3ZvdmthJ1xuICB9LCBcbiAge1xuICAgIG5hbWU6ICdsaXNib2EnLFxuICAgIGJwbTogMTIwLFxuICAgIGdyYWRpZW50Q29sb3JzOiBbJyNmZGJiMmQnLCAnIzIyYzFjMyddLCAgICBcbiAgICBzcGVjdHJ1bUNvbG9yczogWycjRUFFQUVBJywgJyNEQkRCREInLCAnI0YyRjJGMiddLFxuICAgIHNpemU6IFswLjMsIDAuMiwgMC4wNV0sXG4gICAgdGhpY2tuZXNzOiBbMSwgMC43NSwgMC41XSxcbiAgICBib3VuY2U6IFsxLCAwLjgsIDAuN10sXG4gICAgbW9ycGg6IFsxNywgMjAsIDFdLFxuICAgIHNvdW5kY2xvdWRVcmw6ICdodHRwczovL3NvdW5kY2xvdWQuY29tL21vYWlfbXVzaWMvbGlzYm9hJ1xuICB9XG5dO1xuXG4vLyBiYWNrZ3JvdW5kOiNkZTYxNjE7YmFja2dyb3VuZDotd2Via2l0LWxpbmVhci1ncmFkaWVudCh0byByaWdodCwjMjY1N2ViLCNkZTYxNjEpO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCMyNjU3ZWIsI2RlNjE2MSk7XG4iLCIndXNlLXN0cmljdCc7XG5cbi8vIGNvbnN0IGFyZ3YgPSByZXF1aXJlKCd5YXJncycpLmFyZ3ZcblxudmFyIEFwcCA9IHtcbiAgZGVidWc6IHByb2Nlc3MuZW52LkRFQlVHID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2UsXG4gIHNwZWN0cnVtczogW10sXG4gIHNvbmc6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwOyIsIid1c2Utc3RyaWN0JztcblxudmFyIEZyYW1ld29yayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1lbnVPcGVuID0gbnVsbDtcbiAgdGhpcy5tZW51Q2xvc2UgPSBudWxsO1xuICB0aGlzLnZvbHVtZU9uID0gbnVsbDtcbiAgdGhpcy52b2x1bWVPZmYgPSBudWxsO1xuICB0aGlzLm1lbnVQYWdlID0gbnVsbDtcbiAgdGhpcy5tZW51Q29udGVudCA9IG51bGw7XG4gIHRoaXMubmF2UHJldmlvdXMgPSBudWxsO1xuICB0aGlzLm5hdk5leHQgPSBudWxsO1xuICB0aGlzLmZyYW1ld29yayA9IG51bGw7XG4gIHRoaXMuZ2V0RWxlbWVudHMoKTtcbiAgdGhpcy5pbml0RXZlbnRMaXN0ZW5lcnMoKTtcbiAgXG4gIHdpbmRvdy5jb3VudCA9IDA7XG4gIHdpbmRvdy5tZW51SXNPcGVuID0gZmFsc2U7XG4gIFxuICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBpZih3aW5kb3cuY291bnQgPiA1ICYmICF3aW5kb3cubWVudUlzT3Blbikge1xuICAgICAgdGhpcy5mcmFtZXdvcmsuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgIH1cblxuICAgIHdpbmRvdy5jb3VudCArPSAxO1xuICB9LCAxMDAwKTtcbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm1lbnVPcGVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtb3BlbicpO1xuICB0aGlzLm1lbnVDbG9zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51LWNsb3NlZCcpO1xuICB0aGlzLnZvbHVtZU9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZvbHVtZS1vbicpO1xuICB0aGlzLnZvbHVtZU9mZiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2b2x1bWUtb2ZmJyk7XG4gIHRoaXMubWVudVBhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1wYWdlJyk7XG4gIHRoaXMubWVudUNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudS1jb250ZW50Jyk7XG4gIHRoaXMubmF2UHJldmlvdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXByZXZpb3VzJyk7XG4gIHRoaXMubmF2TmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbmV4dCcpO1xuICB0aGlzLmZyYW1ld29yayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcmFtZXdvcmsnKTtcbn07XG5cblxuRnJhbWV3b3JrLnByb3RvdHlwZS5pbml0RXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgaWYodGhpcy5tZW51T3BlbiAhPT0gbnVsbCl7XG4gICAgdGhpcy5tZW51T3Blbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRvZ2dsZU1lbnVfKHRydWUpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIFxuICAgIHRoaXMubWVudUNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudG9nZ2xlTWVudV8oZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIFxuICAgIHRoaXMudm9sdW1lT24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50b2dnbGVWb2x1bWVfKGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICBcbiAgICB0aGlzLnZvbHVtZU9mZi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRvZ2dsZVZvbHVtZV8odHJ1ZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuZnJhbWV3b3JrLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgdGhpcy5yZXNldENvdW50ZXIoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG59O1xuXG5GcmFtZXdvcmsucHJvdG90eXBlLnJlc2V0Q291bnRlciA9IGZ1bmN0aW9uKCkge1xuICB3aW5kb3cuY291bnQgPSAwO1xuICB0aGlzLmZyYW1ld29yay5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG59O1xuXG5cbkZyYW1ld29yay5wcm90b3R5cGUudG9nZ2xlTWVudV8gPSBmdW5jdGlvbihvcGVuKSB7XG4gIGlmKG9wZW4pIHsgXG4gICAgdGhpcy5tZW51UGFnZS5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5Jyk7XG4gICAgdGhpcy5tZW51Q29udGVudC5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5Jyk7XG4gICAgdGhpcy5tZW51T3Blbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB0aGlzLm1lbnVDbG9zZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB3aW5kb3cubWVudUlzT3BlbiA9IHRydWU7ICAgIFxuXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZW51UGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5Jyk7XG4gICAgdGhpcy5tZW51Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5Jyk7XG4gICAgdGhpcy5tZW51T3Blbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB0aGlzLm1lbnVDbG9zZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICB3aW5kb3cubWVudUlzT3BlbiA9IGZhbHNlO1xuICAgIFxuICB9XG59O1xuXG5cbkZyYW1ld29yay5wcm90b3R5cGUudG9nZ2xlVm9sdW1lXyA9IGZ1bmN0aW9uKG9uKSB7XG4gIGlmKG9uKSB7XG4gICAgd2luZG93Lmdsb2JhbFA1Lm1hc3RlclZvbHVtZSA9IDE7XG4gICAgdGhpcy52b2x1bWVPbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB0aGlzLnZvbHVtZU9mZi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICBcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuZ2xvYmFsUDUubWFzdGVyVm9sdW1lID0gMDtcbiAgICB0aGlzLnZvbHVtZU9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIHRoaXMudm9sdW1lT2ZmLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWV3b3JrOyIsIid1c2Utc3RyaWN0JztcblxudmFyIEFwcCA9IHJlcXVpcmUoJy4vYXBwJyk7XG52YXIgRnJhbWV3b3JrID0gcmVxdWlyZSgnLi9mcmFtZXdvcmsnKTtcbnZhciBTcGVjdHJ1bSA9IHJlcXVpcmUoJy4vc3BlY3RydW0nKTtcbnZhciBTa2V0Y2ggPSByZXF1aXJlKCcuL3NrZXRjaCcpO1xudmFyIERlYnVnID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZGVidWcnKTtcbnZhciBTb25nID0gcmVxdWlyZSgnLi9zb25nJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvc29uZ3MnKTtcbnZhciBnZXRJbmRleCA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2dldEluZGV4Jyk7XG5cblxudmFyIGluaXRBcHAgPSBmdW5jdGlvbigpIHsgLy9kZWJ1Z2dlcjtcbiAgLy8gRnJhbWV3b3JrIGluaXRcbiAgdmFyIGZyYW1ld29yayA9IG5ldyBGcmFtZXdvcmsoKTtcbiAgZnJhbWV3b3JrLmdldEVsZW1lbnRzKCk7XG4gIGZyYW1ld29yay5pbml0RXZlbnRMaXN0ZW5lcnMoKTtcblxuICBBcHAuZnJhbWV3b3JrID0gZnJhbWV3b3JrO1xuICBcbiAgLy8gU3BlY3RydW0gaW5pdFxuICAvLyAobmFtZSwgY29sb3IsIHNpemUsIHRoaWNrbmVzcywgYm91bmNlLCBtb3JwaClcbiAgdmFyIHAgPSBnZXRTcGVjdHJ1bVBhcmFtcygpOyBjb25zb2xlLmxvZygncCcsIHApXG5cbiAgdmFyIHMxID0gbmV3IFNwZWN0cnVtKCdzMScsIHAuY29sb3JzWzBdLCBwLnNpemVbMF0sIHAudGhpY2tuZXNzWzBdLCBwLmJvdW5jZVswXSwgcC5tb3JwaFswXSk7IFxuICBBcHAuc3BlY3RydW1zLnB1c2goczEpO1xuXG4gIHZhciBzMiA9IG5ldyBTcGVjdHJ1bSgnczInLCBwLmNvbG9yc1sxXSwgcC5zaXplWzFdLCBwLnRoaWNrbmVzc1sxXSwgcC5ib3VuY2VbMV0sIHAubW9ycGhbMV0pOyBcbiAgQXBwLnNwZWN0cnVtcy5wdXNoKHMyKTtcblxuICB2YXIgczMgPSBuZXcgU3BlY3RydW0oJ3MzJywgcC5jb2xvcnNbMl0sIHAuc2l6ZVsyXSwgcC50aGlja25lc3NbMl0sIHAuYm91bmNlWzJdLCBwLm1vcnBoWzJdKTsgXG4gIEFwcC5zcGVjdHJ1bXMucHVzaChzMyk7XG4gIFxuXG4gIC8vIFNvbmcgaW5pdFxuICBBcHAuc29uZyA9IG5ldyBTb25nKCk7XG4gIFxuICAvLyBwdXQgdGhpcyBhcHAgb2JqZWN0IGludG8gdGhlIGdsb2JhbCB3aW5kb3dcbiAgd2luZG93LnRoaXNBcHAgPSBBcHA7XG4gIFxuICAvLyBQNSBza2V0Y2hcbiAgdmFyIG1vYWlQNSA9IG5ldyBwNShTa2V0Y2gsICdsYXllcjEnKTtcbn07XG5cblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICBpbml0QXBwKCk7XG59O1xuXG5cbnZhciBnZXRTcGVjdHJ1bVBhcmFtcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaSA9IGdldEluZGV4KCk7XG5cbiAgdmFyIGR5bmFtaWNTcGVjdHJ1bUhlaWdodHMgPSAgZGF0YVtpXS5zaXplXG4gICAgLm1hcChmdW5jdGlvbihyYXRpbykge1xuICAgICAgcmV0dXJuIHJhdGlvICogIE1hdGgubWluKHdpbmRvdy5pbm5lckhlaWdodCwgd2luZG93LmlubmVyV2lkdGgpO1xuICAgIH0pO1xuICBcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBkYXRhW2ldLm5hbWUsXG4gICAgY29sb3JzOiBkYXRhW2ldLnNwZWN0cnVtQ29sb3JzLFxuICAgIHNpemU6IGR5bmFtaWNTcGVjdHJ1bUhlaWdodHMsXG4gICAgdGhpY2tuZXNzOiBkYXRhW2ldLnRoaWNrbmVzcyxcbiAgICBib3VuY2U6IGRhdGFbaV0uYm91bmNlLFxuICAgIG1vcnBoOiBkYXRhW2ldLm1vcnBoXG4gIH1cbn07IiwiJ3VzZS1zdHJpY3QnO1xuXG52YXIgQXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcbnZhciBTb25nID0gcmVxdWlyZSgnLi9zb25nJyk7XG52YXIgRGVidWcgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9kZWJ1ZycpO1xudmFyIGdldEluZGV4ID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZ2V0SW5kZXgnKTtcblxudmFyIHMgPSBmdW5jdGlvbihza2V0Y2gpIHsgLy9kZWJ1Z2dlcjtcbiAgdmFyIGxvYWRlZCA9IGZhbHNlO1xuICB3aW5kb3cuZ2xvYmFsUDUgPSBza2V0Y2g7IC8vIGdsb2JhbCBjb3B5IG9mIHA1XG5cbiAgc2tldGNoLnByZWxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5kZXggPSBnZXRJbmRleCgpO1xuXG4gICAgdmFyIHVybCA9ICcvcHVibGljL2F1ZGlvLycgKyBpbmRleCArICcubXAzJztcbiAgICB3aW5kb3cudGhpc0FwcC5zb25nLnNvdW5kID0gZ2xvYmFsUDUubG9hZFNvdW5kKHVybCk7XG4gIH07XG5cbiAgc2tldGNoLnNldHVwID0gZnVuY3Rpb24oKSB7XG4gICAgc2tldGNoLmNyZWF0ZUNhbnZhcyhza2V0Y2gud2luZG93V2lkdGgsIHNrZXRjaC53aW5kb3dIZWlnaHQpOyAgXG4gICAgc2tldGNoLmZyYW1lUmF0ZSgyMCk7XG4gICAgd2luZG93LnRoaXNBcHAuc29uZy5wbGF5KCk7XG4gIH07XG5cbiAgc2tldGNoLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICBpZighbG9hZGVkKSB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGF5ZXIxJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIGlmKHR5cGVvZiB3aW5kb3cudGhpc0FwcCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHNrZXRjaC5jbGVhcigpO1xuICAgICAgc2tldGNoLmJhY2tncm91bmQoJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCknKTtcbiAgICBcbiAgICAgIHdpbmRvdy50aGlzQXBwLnNvbmcuc2V0V2F2ZWZvcm0oKTtcbiAgICBcbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBBcHAuc3BlY3RydW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHdpbmRvdy50aGlzQXBwLnNwZWN0cnVtc1tqXS5kcmF3KHNrZXRjaCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzOyIsInZhciBTb25nID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGltZURhdGEgPSBbXTtcbiAgdGhpcy5zb25nSWQgPSB0aGlzLmdldFNvbmdJZF8oKTtcbiAgdGhpcy5zb3VuZDsgLyo9IHRoaXMubG9hZFNvdW5kXygpOyovXG4gIHRoaXMuZHVyYXRpb24gLyo9IHRoaXMuZ2V0U29uZ0R1cmF0aW9uXygpOyovXG4gIHRoaXMuYnBtID0gdGhpcy5nZXRCUE0oKTtcbiAgdGhpcy5mZnQgPSB0aGlzLmdldEZGVF8oKTtcbiAgdGhpcy53YXZlZm9ybSA9IHRoaXMuZmZ0LndhdmVmb3JtKCk7XG4gIHRoaXMuc3BlY3RydW0gPSB0aGlzLmZmdC5hbmFseXplKCk7XG4gIHRoaXMuYmFzc0VuZXJneSA9IHRoaXMuZmZ0LmdldEVuZXJneSgnYmFzcycpO1xuICB0aGlzLm1pZEVuZXJneSA9IHRoaXMuZmZ0LmdldEVuZXJneSgnbWlkJyk7XG4gIHRoaXMuaGlnaEVuZXJneSA9IHRoaXMuZmZ0LmdldEVuZXJneSgndHJlYmxlJyk7XG4gIHRoaXMuZ2V0VGltZUNhbGN1bGF0aW9uc18oKTtcbn07XG5cblNvbmcucHJvdG90eXBlLmdldFNvbmdJZF8gPSBmdW5jdGlvbigpIHtcbiAgaWYod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiAnaW5kZXgnO1xuICB9IGVsc2Uge1xuICAgIC8vIDYgPSAvc29uZy9cbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNsaWNlKDYsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5sZW5ndGgpO1xuICB9XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRCUE0gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDEyMDtcbn07XG5cblNvbmcucHJvdG90eXBlLmxvYWRTb3VuZF8gPSBmdW5jdGlvbihtb2FpUDUpIHsgLy9kZWJ1Z2dlcjtcbiAgLy8gdmFyIHVybCA9ICcvcHVibGljL2F1ZGlvLycrIHRoaXMuc29uZ0lkICsnLm1wMyc7XG4gIC8vIHJldHVybiBnbG9iYWxQNS5sb2FkU291bmQodXJsKTtcbn07XG5cblNvbmcucHJvdG90eXBlLmdldFNvbmdEdXJhdGlvbl8gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc291bmQuZHVyYXRpb24oKTtcbn07XG5cblNvbmcucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zb3VuZC5wbGF5KCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRGRlRfID0gZnVuY3Rpb24obW9haVA1KSB7XG4gIHJldHVybiBuZXcgd2luZG93LnA1LkZGVDtcbn07XG5cblNvbmcucHJvdG90eXBlLmdldFdhdmVmb3JtID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLndhdmVmb3JtO1xufTtcblxuU29uZy5wcm90b3R5cGUuc2V0V2F2ZWZvcm0gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy53YXZlZm9ybSA9IHRoaXMuZmZ0LndhdmVmb3JtKCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRTcGVjdHJhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zcGVjdHJ1bTtcbn07XG5cblNvbmcucHJvdG90eXBlLnNldFNwZWN0cmFsID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BlY3RydW0gPSB0aGlzLmZmdC5hbmFseXplKCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRFbmVyZ3lfID0gZnVuY3Rpb24oZnJlcXVlbmN5UmFuZ2UpIHtcbiAgcmV0dXJuIHRoaXMuZmZ0LmdldEVuZXJneShmcmVxdWVuY3lSYW5nZSk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS52b2x1bWVPbiA9IGZ1bmN0aW9uKG1vYWlQNSkge1xuICB3aW5kb3cucDUubWFzdGVyVm9sdW1lKDEpO1xufTtcblxuU29uZy5wcm90b3R5cGUudm9sdW1lT2ZmID0gZnVuY3Rpb24obW9haVA1KSB7XG4gIHdpbmRvdy5wNS5tYXN0ZXJWb2x1bWUoMCk7XG59O1xuXG5Tb25nLnByb3RvdHlwZS5nZXRUaW1lQ2FsY3VsYXRpb25zXyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBiYXNlID0gMjQwMDAwIC8gdGhpcy5icG07XG5cbiAgICBmb3IodmFyIGkgPSAxOyBpIDw9IDE2OyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBpLnRvU3RyaW5nKCk7XG4gICAgICB2YXIgdmFsdWUgPSBiYXNlIC8gaTtcbiAgICAgIHRoaXMudGltZURhdGEucHVzaCh7IGtleTogdmFsdWUgfSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb25nOyIsInZhciBTcGVjdHJ1bSA9IGZ1bmN0aW9uKG5hbWUsIGNvbG9yLCBzaXplLCB0aGlja25lc3MsIGJvdW5jZSwgbW9ycGgpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICB0aGlzLnNpemUgPSBzaXplO1xuICB0aGlzLnRoaWNrbmVzcyA9IHRoaWNrbmVzcztcbiAgdGhpcy5ib3VuY2UgPSBib3VuY2U7XG4gIHRoaXMubW9ycGggPSBtb3JwaDtcbiAgdGhpcy53YXZlZm9ybSA9IFtdO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLnNldENvbG9yXyA9IGZ1bmN0aW9uKG5ld0NvbG9yKSB7XG4gIHRoaXMuY29sb3IgPSBuZXdDb2xvcjtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5zZXRTaXplXyA9IGZ1bmN0aW9uKG5ld1NpemUpIHtcbiAgICB0aGlzLnNpemUgPSBuZXdTaXplO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLnNldFRoaWNrbmVzc18gPSBmdW5jdGlvbihuZXdUaGlja25lc3MpIHtcbiAgdGhpcy50aGlja25lc3MgPSBuZXdUaGlja25lc3M7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUuc2V0Qm91bmNlXyA9IGZ1bmN0aW9uKG5ld0JvdW5jZSkge1xuICB0aGlzLmJvdW5jZSA9IG5ld0JvdW5jZTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5zZXRNb3JwaF8gPSBmdW5jdGlvbihuZXdNb3JwaCkge1xuICB0aGlzLm1vcnBoID0gbmV3TW9ycGg7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUuYWRkVG9Hcm91cF8gPSBmdW5jdGlvbigpIHtcbiAgc3BlY3RydW1zLnB1c2godGhpcyk7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUuZHJhdyA9ICBmdW5jdGlvbihza2V0Y2gpIHtcbiAgc2tldGNoLm5vRmlsbCgpO1xuICBza2V0Y2guc3Ryb2tlKHRoaXMuY29sb3IpO1xuICBza2V0Y2guc3Ryb2tlV2VpZ2h0KHRoaXMudGhpY2tuZXNzKTtcbiAgc2tldGNoLmJlZ2luU2hhcGUoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDM2MDsgaSsrKXtcblxuICAgIHZhciB3YXZlID0gdGhpcy5nZXREeW5hbWljTGVuZ3RoXyhpLCBza2V0Y2gpO1xuXG4gICAgdmFyIHgxID0gdGhpcy5nZXRDaXJjdWxhclhfKGksIHNrZXRjaCk7XG4gICAgdmFyIHkxID0gdGhpcy5nZXRDaXJjdWxhcllfKGksIHNrZXRjaCk7XG5cbiAgICB2YXIgeF93YXZlID0gdGhpcy5waXRjaFhfKHdhdmUsIGkpO1xuICAgIHZhciB5X3dhdmUgPSB0aGlzLnBpdGNoWV8od2F2ZSwgaSk7XG5cbiAgICB2YXIgeDIgPSB4MSArIHhfd2F2ZTtcbiAgICB2YXIgeTIgPSB5MSArIHlfd2F2ZTtcblxuICAgIHNrZXRjaC5jdXJ2ZVZlcnRleCh4MiwgeTIpO1xuICB9XG4gIHNrZXRjaC5lbmRTaGFwZSgpO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmdldER5bmFtaWNMZW5ndGhfID0gZnVuY3Rpb24oaSwgc2tldGNoKSB7XG4gIHZhciB3YXZlZm9ybSA9IHdpbmRvdy50aGlzQXBwLnNvbmcuZ2V0V2F2ZWZvcm0oKTtcbiAgLy8gcmV0dXJuIHNrZXRjaC5tYXAod2F2ZWZvcm1baSAqIHRoaXMubW9ycGhdIC8gdGhpcy5ib3VuY2UsIC0xLCAxLCAwLCAxNTApO1xuICByZXR1cm4gc2tldGNoLm1hcCh3YXZlZm9ybVtpICogdGhpcy5tb3JwaF0gLyB0aGlzLmJvdW5jZSwgLTEsIDEsIDAsIDE1MCk7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUuZ2V0Q2lyY3VsYXJYXyA9IGZ1bmN0aW9uKGksIHNrZXRjaCkge1xuICByZXR1cm4gKHRoaXMuc2l6ZSAqIE1hdGguc2luKGkgKiB0aGlzLm1vcnBoKSArIHNrZXRjaC53aWR0aCAvIDIpO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmdldENpcmN1bGFyWV8gPSBmdW5jdGlvbihpLCBza2V0Y2gpIHtcbiAgcmV0dXJuICh0aGlzLnNpemUgKiBNYXRoLmNvcyhpICogdGhpcy5tb3JwaCkgKyBza2V0Y2guaGVpZ2h0IC8gMik7XG59O1xuXG5TcGVjdHJ1bS5wcm90b3R5cGUucGl0Y2hYXyA9IGZ1bmN0aW9uKHdhdmUsIGkpIHtcbiAgcmV0dXJuIHdhdmUgKiBNYXRoLnNpbihpKTtcbn07XG5cblNwZWN0cnVtLnByb3RvdHlwZS5waXRjaFlfID0gZnVuY3Rpb24od2F2ZSwgaSkge1xuICByZXR1cm4gd2F2ZSAqIE1hdGguY29zKGkpO1xufTtcblxuU3BlY3RydW0ucHJvdG90eXBlLmNoYW5nZUNvbG9yXyA9IGZ1bmN0aW9uKCkge307XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTcGVjdHJ1bTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBBcHAgPSByZXF1aXJlKCcuLi9hcHAnKTtcblxudmFyIERlYnVnID0gZnVuY3Rpb24oLyogYXJndW1lbnRzICovKSB7IC8vZGVidWdnZXI7XG4gIGlmKEFwcC5kZWJ1Zykge1xuICAgIHZhciBwcmludHMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cyk7XG4gIFxuICAgIHByaW50cy5tYXAoZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgaWYodHlwZW9mIGFyZ3VtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIHByaW50ID0gdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnIFxuICAgICAgICAgID8gSlNPTi5zdHJpbmdpZnkoaXRlbSkgXG4gICAgICAgICAgOiBpdGVtXG4gICAgICAgIFxuICAgICAgICAgIGNvbnNvbGUubG9nKGksIHByaW50KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlYnVnOyIsInZhciBnZXRJbmRleCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmxlbmd0aCA9PT0gMSBcbiAgICA/ICdpbmRleCdcbiAgICA6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zbGljZSg2LCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUubGVuZ3RoKTsgLy8gbnVtICBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0SW5kZXg7IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiJdfQ==
