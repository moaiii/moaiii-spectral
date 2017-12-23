Moai.Spectrum = function(name, color, size, thickness, bounce, morph) {
  this.name = name;
  this.color = color;
  this.size = size;
  this.thickness = thickness;
  this.bounce = bounce;
  this.morph = morph;
  this.waveform = [];
  this.addToGroup_();
  this.draw();
};

Moai.Spectrum.prototype.setColor_ = function(newColor) {
  this.color = newColor;
};

Moai.Spectrum.prototype.setSize_ = function(newSize) {
    this.size = newSize;
};

Moai.Spectrum.prototype.setThickness_ = function(newThickness) {
  this.thickness = newThickness;
};

Moai.Spectrum.prototype.setBounce_ = function(newBounce) {
  this.bounce = newBounce;
};

Moai.Spectrum.prototype.setMorph_ = function(newMorph) {
  this.morph = newMorph;
};

Moai.Spectrum.prototype.addToGroup_ = function() {
  Moai.spectrums.push(this);
};

Moai.Spectrum.prototype.draw =  function() {
  noFill();
  stroke(this.color);
  strokeWeight(this.thickness);
  beginShape();

  for (var i = 0; i < 360; i++){

    var wave = this.getDynamicLength_(i);

    var x1 = this.getCircularX_(i);
    var y1 = this.getCircularY_(i);

    var x_wave = this.pitchX_(wave, i);
    var y_wave = this.pitchY_(wave, i);

    var x2 = x1 + x_wave;
    var y2 = y1 + y_wave;

    curveVertex(x2, y2);
  }
  endShape();
};

Moai.Spectrum.prototype.getDynamicLength_ = function(i) {
  var waveform = Moai.song.getWaveform();
  return map(waveform[i * this.morph] / this.bounce, -1, 1, 0, 150);
};

Moai.Spectrum.prototype.getCircularX_ = function(i) {
  return (this.size * Math.sin(i * this.morph) + width / 2);
};

Moai.Spectrum.prototype.getCircularY_ = function(i) {
  return (this.size * Math.cos(i * this.morph) + height / 2);
};

Moai.Spectrum.prototype.pitchX_ = function(wave, i) {
  return wave * Math.sin(i);
};

Moai.Spectrum.prototype.pitchY_ = function(wave, i) {
  return wave * Math.cos(i);
};

Moai.Spectrum.prototype.changeColor_ = function() {};
