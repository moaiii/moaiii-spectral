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