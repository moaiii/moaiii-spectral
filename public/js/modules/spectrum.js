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