(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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
},{"_process":3,"fs":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports=[{name:"index",bpm:120,gradientColors:["#fdbb2d","#22c1c3"],spectrumColors:["#EAEAEA","#DBDBDB","#F2F2F2"],size:[.5,.4,.3],thickness:[1,.75,.5],bounce:[.25,.5,1],morph:[1,4,7],soundcloudUrl:"https://soundcloud.com/moai_music/intro"},{name:"rojo",bpm:120,gradientColors:["#ff6a00","#ee0979"],spectrumColors:["#EAEAEA","#DBDBDB","#F2F2F2"],size:[.3,.15,.06],thickness:[1,.75,.5],bounce:[1,.8,.7],morph:[5,20,1],soundcloudUrl:"https://soundcloud.com/moai_music/rojo"},{name:"vovka",bpm:120,gradientColors:["#2657eb","#de6161"],spectrumColors:["#EAEAEA","#DBDBDB","#F2F2F2"],size:[.35,.15,.27],thickness:[1,.75,.5],bounce:[2,.5,1],morph:[20,5,1],soundcloudUrl:"https://soundcloud.com/moai_music/vovka"},{name:"lisboa",bpm:120,gradientColors:["#fdbb2d","#22c1c3"],spectrumColors:["#EAEAEA","#DBDBDB","#F2F2F2"],size:[.3,.2,.05],thickness:[1,.75,.5],bounce:[1,.8,.7],morph:[17,20,1],soundcloudUrl:"https://soundcloud.com/moai_music/lisboa"}];

},{}],5:[function(require,module,exports){
(function (process){
"use-strict";var App={debug:"true"===process.env.DEBUG,spectrums:[],song:null};module.exports=App;

}).call(this,require('_process'))
},{"_process":3}],6:[function(require,module,exports){
"use-strict";var Framework=function(){this.menuOpen=null,this.menuClose=null,this.volumeOn=null,this.volumeOff=null,this.menuPage=null,this.menuContent=null,this.navPrevious=null,this.navNext=null,this.framework=null,this.morpher=null,this.instructions=null,this.getElements(),this.initEventListeners(),window.count=0,window.menuIsOpen=!1,window.spectrumSelection=0,setInterval(function(){window.count>5&&!window.menuIsOpen&&this.framework.classList.add("hide"),window.count+=1},1e3)};Framework.prototype.getElements=function(){this.menuOpen=document.getElementById("menu-open"),this.menuClose=document.getElementById("menu-closed"),this.volumeOn=document.getElementById("volume-on"),this.volumeOff=document.getElementById("volume-off"),this.menuPage=document.getElementById("menu-page"),this.menuContent=document.getElementById("menu-content"),this.navPrevious=document.getElementById("nav-previous"),this.navNext=document.getElementById("nav-next"),this.framework=document.getElementById("framework"),this.morpher=document.getElementsByClassName("title")[0],this.instructions=document.getElementById("instructions")},Framework.prototype.initEventListeners=function(){null!==this.menuOpen&&(this.menuOpen.addEventListener("click",function(){this.toggleMenu_(!0)}.bind(this)),this.menuClose.addEventListener("click",function(){this.toggleMenu_(!1)}.bind(this)),this.morpher.addEventListener("click",function(){this.morph_()}.bind(this)),this.morpher.addEventListener("mousemove",function(e){this.stretch_(e)}.bind(this)),this.volumeOn.addEventListener("click",function(){this.toggleVolume_(!1)}.bind(this)),this.volumeOff.addEventListener("click",function(){this.toggleVolume_(!0)}.bind(this)),this.framework.addEventListener("mousemove",function(e){this.resetCounter()}.bind(this)));var e=this;setTimeout(function(){e.instructions.classList.add("hide")},15e3)},Framework.prototype.resetCounter=function(){window.count=0,this.framework.classList.remove("hide")},Framework.prototype.toggleMenu_=function(e){e?(this.menuPage.classList.add("display"),this.menuContent.classList.add("display"),this.menuOpen.classList.add("hidden"),this.menuClose.classList.remove("hidden"),window.menuIsOpen=!0):(this.menuPage.classList.remove("display"),this.menuContent.classList.remove("display"),this.menuOpen.classList.remove("hidden"),this.menuClose.classList.add("hidden"),window.menuIsOpen=!1)},Framework.prototype.toggleVolume_=function(e){e?(window.globalP5.masterVolume=1,this.volumeOn.classList.remove("hidden"),this.volumeOff.classList.add("hidden")):(window.globalP5.masterVolume=0,this.volumeOn.classList.add("hidden"),this.volumeOff.classList.remove("hidden"))},Framework.prototype.morph_=function(){console.log("morphing");var e=Math.ceil(20*Math.random());window.thisApp.spectrums[window.spectrumSelection].morph=e,window.spectrumSelection=2===window.spectrumSelection?0:window.spectrumSelection+=1},Framework.prototype.stretch_=function(e){var t=e.clientX/window.innerWidth,n=e.clientY/window.innerHeight,i=Math.max(.2,3*Math.abs(.5-Math.max(t,n)));window.thisApp.spectrums[window.spectrumSelection].bounce=i},module.exports=Framework;

},{}],7:[function(require,module,exports){
"use-strict";var App=require("./app"),Framework=require("./framework"),Spectrum=require("./spectrum"),Sketch=require("./sketch"),Debug=require("./utilities/debug"),Song=require("./song"),data=require("../../data/data"),getIndex=require("./utilities/getIndex"),initApp=function(){var e=new Framework;e.getElements(),e.initEventListeners(),App.framework=e;var r=getSpectrumParams();Debug(r);var t=new Spectrum("s1",r.colors[0],r.size[0],r.thickness[0],r.bounce[0],r.morph[0]),n=new Spectrum("s2",r.colors[1],r.size[1],r.thickness[1],r.bounce[1],r.morph[1]),s=new Spectrum("s3",r.colors[2],r.size[2],r.thickness[2],r.bounce[2],r.morph[2]);App.spectrums.push(t),App.spectrums.push(n),App.spectrums.push(s),App.song=new Song,window.thisApp=App;new p5(Sketch,"layer1")};window.onload=function(){initApp()};var getSpectrumParams=function(){var e=getIndex(),r=data[e].size.map(function(e){return e*Math.min(window.innerHeight,window.innerWidth)});return{name:data[e].name,colors:data[e].spectrumColors,size:r,thickness:data[e].thickness,bounce:data[e].bounce,morph:data[e].morph}};

},{"../../data/data":4,"./app":5,"./framework":6,"./sketch":8,"./song":9,"./spectrum":10,"./utilities/debug":11,"./utilities/getIndex":12}],8:[function(require,module,exports){
"use-strict";require("dotenv").config();var App=require("./app"),Song=require("./song"),Debug=require("./utilities/debug"),getIndex=require("./utilities/getIndex"),s=function(e){window.globalP5=e,e.preload=function(){var e=getIndex();console.log("process.env.ENV","production");var o="/dist/audio/"+e+".mp3";window.thisApp.song.sound=globalP5.loadSound(o)},e.setup=function(){e.createCanvas(e.windowWidth,e.windowHeight),e.frameRate(20),window.thisApp.song.play()},e.draw=function(){if(document.getElementById("layer1").classList.remove("hidden"),this.loaded=!0,void 0!==window.thisApp){e.clear(),e.background("rgba(255, 255, 255, 0)"),window.thisApp.song.setWaveform();for(var o=0;o<App.spectrums.length;o++)window.thisApp.spectrums[o].draw(e)}}};module.exports=s;

},{"./app":5,"./song":9,"./utilities/debug":11,"./utilities/getIndex":12,"dotenv":2}],9:[function(require,module,exports){
var Song=function(){this.timeData=[],this.songId=this.getSongId_(),this.sound,this.duration,this.bpm=this.getBPM(),this.fft=this.getFFT_(),this.waveform=this.fft.waveform(),this.spectrum=this.fft.analyze(),this.bassEnergy=this.fft.getEnergy("bass"),this.midEnergy=this.fft.getEnergy("mid"),this.highEnergy=this.fft.getEnergy("treble"),this.getTimeCalculations_()};Song.prototype.getSongId_=function(){return 1===window.location.pathname.length?"index":window.location.pathname.slice(6,window.location.pathname.length)},Song.prototype.getBPM=function(){return 120},Song.prototype.loadSound_=function(t){},Song.prototype.getSongDuration_=function(){return this.sound.duration()},Song.prototype.play=function(){this.sound.play()},Song.prototype.getFFT_=function(t){return new window.p5.FFT},Song.prototype.getWaveform=function(){return this.waveform},Song.prototype.setWaveform=function(){this.waveform=this.fft.waveform()},Song.prototype.getSpectral=function(){return this.spectrum},Song.prototype.setSpectral=function(){this.spectrum=this.fft.analyze()},Song.prototype.getEnergy_=function(t){return this.fft.getEnergy(t)},Song.prototype.volumeOn=function(t){window.p5.masterVolume(1)},Song.prototype.volumeOff=function(t){window.p5.masterVolume(0)},Song.prototype.getTimeCalculations_=function(){for(var t=24e4/this.bpm,o=1;o<=16;o++){o.toString();var n=t/o;this.timeData.push({key:n})}},module.exports=Song;

},{}],10:[function(require,module,exports){
var Spectrum=function(t,e,o,r,i,p){this.name=t,this.color=e,this.size=o,this.thickness=r,this.bounce=i,this.morph=p,this.waveform=[]};Spectrum.prototype.setColor_=function(t){this.color=t},Spectrum.prototype.setSize_=function(t){this.size=t},Spectrum.prototype.setThickness_=function(t){this.thickness=t},Spectrum.prototype.setBounce_=function(t){this.bounce=t},Spectrum.prototype.setMorph_=function(t){this.morph=t},Spectrum.prototype.addToGroup_=function(){spectrums.push(this)},Spectrum.prototype.draw=function(t){t.noFill(),t.stroke(this.color),t.strokeWeight(this.thickness),t.beginShape();for(var e=0;e<360;e++){var o=this.getDynamicLength_(e,t),r=this.getCircularX_(e,t),i=this.getCircularY_(e,t),p=r+this.pitchX_(o,e),c=i+this.pitchY_(o,e);t.curveVertex(p,c)}t.endShape()},Spectrum.prototype.getDynamicLength_=function(t,e){var o=window.thisApp.song.getWaveform();return e.map(o[t*this.morph]/this.bounce,-1,1,0,150)},Spectrum.prototype.getCircularX_=function(t,e){return this.size*Math.sin(t*this.morph)+e.width/2},Spectrum.prototype.getCircularY_=function(t,e){return this.size*Math.cos(t*this.morph)+e.height/2},Spectrum.prototype.pitchX_=function(t,e){return t*Math.sin(e)},Spectrum.prototype.pitchY_=function(t,e){return t*Math.cos(e)},Spectrum.prototype.changeColor_=function(){},module.exports=Spectrum;

},{}],11:[function(require,module,exports){
"use strict";var App=require("../app"),Debug=function(){};module.exports=Debug;

},{"../app":5}],12:[function(require,module,exports){
var getIndex=function(){return 1===window.location.pathname.length?"index":window.location.pathname.slice(6,window.location.pathname.length)};module.exports=getIndex;

},{}]},{},[7]);
