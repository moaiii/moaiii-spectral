Moai.Song = function() {
  this.timeData = [];
  this.songId = this.getSongId_();
  this.sound = this.loadSound_();
  this.duration = this.getSongDuration_();
  this.bpm = this.getBPM();
  this.fft = this.getFFT_();
  this.waveform = this.fft.waveform();
  this.spectrum = this.fft.analyze();
  this.bassEnergy = this.fft.getEnergy('bass');
  this.midEnergy = this.fft.getEnergy('mid');
  this.highEnergy = this.fft.getEnergy('treble');
  this.getTimeCalculations_();
  this.setAsGlobalSong();
};

Moai.Song.prototype.getSongId_ = function() {
  if(window.location.pathname.length == 1) {
    return 'index';
  } else {
    return window.location.pathname.slice(1,window.location.pathname.length);
  }
};

Moai.Song.prototype.getBPM = function() {
  for (var songname in Moai.bpms) {
    if (songname === this.songId)
      return Moai.bpms[songname];
  }
};

Moai.Song.prototype.loadSound_ = function() {
  return loadSound('../audio/'+ this.songId +'.mp3');
};

Moai.Song.prototype.getSongDuration_ = function() {
  return this.sound.duration();
};

Moai.Song.prototype.play = function() {
  this.sound.play();
};

Moai.Song.prototype.getFFT_ = function() {
  return new p5.FFT();
};

Moai.Song.prototype.getWaveform = function() {
  return this.waveform;
};

Moai.Song.prototype.setWaveform = function() {
  this.waveform = this.fft.waveform();
};

Moai.Song.prototype.getSpectral = function() {
  return this.spectrum;
};

Moai.Song.prototype.setSpectral = function() {
  this.spectrum = this.fft.analyze();
};

Moai.Song.prototype.getEnergy_ = function(frequencyRange) {
  return this.fft.getEnergy(frequencyRange);
};

Moai.Song.prototype.setAsGlobalSong = function() {
  Moai.song = this;
};

Moai.Song.prototype.volumeOn = function() {
  masterVolume(1);
};

Moai.Song.prototype.volumeOff = function() {
  masterVolume(0);
};

Moai.Song.prototype.getTimeCalculations_ = function() {
    var base = 240000 / this.bpm;

    for(var i = 1; i<=16; i++) {
      var key = i.toString();
      var value = base / i;
      this.timeData.push({ key: value });
    }
};
