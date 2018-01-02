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