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