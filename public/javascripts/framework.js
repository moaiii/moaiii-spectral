Moai.Framework = function() {
  this.menuOpen = null;
  this.menuClose = null;
  this.volumeOn = null;
  this.volumeOff = null;
  this.menuPage = null;
  this.menuContent = null;
  this.navPrevious = null;
  this.navNext = null;
  this.getElements();
  this.initEventListeners_();
  this.setVideoPlaybackRate(0.8);
};

Moai.Framework.prototype.getElements = function() {

  this.menuOpen = document.getElementById('menu-open');
  this.menuClose = document.getElementById('menu-closed');
  this.volumeOn = document.getElementById('volume-on');
  this.volumeOff = document.getElementById('volume-off');
  this.menuPage = document.getElementById('menu-page');
  this.menuContent = document.getElementById('menu-content');
  this.navPrevious = document.getElementById('nav-previous');
  this.navNext = document.getElementById('nav-next');
};

Moai.Framework.prototype.initEventListeners_ = function() {
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
  
    this.navPrevious.addEventListener("mouseOver", function() {
      this.showSongTitle(this);
    }.bind(this));
  
    this.navNext.addEventListener("mouseOver", function() {
      this.showSongTitle(this);
    }.bind(this));
  }
};

Moai.Framework.prototype.toggleMenu_ = function(open) {
  if(open) {
    this.menuPage.classList.add('display');
    this.menuContent.classList.add('display');
    this.menuOpen.classList.add('hidden');
    this.menuClose.classList.remove('hidden');
  } else {
    this.menuPage.classList.remove('display');
    this.menuContent.classList.remove('display');
    this.menuOpen.classList.remove('hidden');
    this.menuClose.classList.add('hidden');
  }
};

Moai.Framework.prototype.toggleVolume_ = function(on) {
  if(on) {
    Moai.song.volumeOn();
    this.volumeOn.classList.remove('hidden');
    this.volumeOff.classList.add('hidden');
  } else {
    Moai.song.volumeOff();
    this.volumeOn.classList.add('hidden');
    this.volumeOff.classList.remove('hidden');
  }
};

Moai.Framework.prototype.showSongTitle= function() {
  console.log(this);
};

Moai.Framework.prototype.setVideoPlaybackRate = function(rate) {
  // document.getElementById("layer2").playbackRate = rate;
};
