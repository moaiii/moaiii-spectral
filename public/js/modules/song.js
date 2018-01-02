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