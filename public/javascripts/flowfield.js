Moai.Flowfield = function(xInc, yInc, zInc, scale, particles, debug) {
  this.flowfield = [];
  this.xIncrement = xInc;
  this.yIncrement = yInc;
  this.zIncrement = zInc;
  this.scale = scale;
  this.canvasHeight = windowHeight;
  this.canvasWidth = windowWidth;
  this.columns = this.getColumns_();
  this.columnSize = this.columns / this.scale;
  this.rows = this.getRows_();
  this.rowSize = this.rows / this.scale;
  this.flowfield = new Array(this.columns * this.rows);
  this.x = 0;
  this.y = 0;
  this.z = 0;
};

Moai.Flowfield.prototype.getColumns_ = function() {
  return floor(this.canvasWidth / this.scale);
};

Moai.Flowfield.prototype.getRows_ = function() {
  return floor(this.canvasHeight / this.scale);
};

Moai.Flowfield.prototype.createVector_ = function(angle, magnitude) {
  var vector = p5.Vector.fromAngle(angle);
  return vector.setMag(magnitude);
};

Moai.Flowfield.prototype.draw = function() {
  this.y = 0;
  for (var y = 0; y < this.rows; y++) {
    this.x = 0;
    for (var x = 0; x < this.columns; x++) {
      var index = (x + y * width) * 4;
      var angle = noise(this.x, this.y, this.z) * TWO_PI;
      var v = p5.Vector.fromAngle(angle);
      this.x += this.xIncrement;
      stroke(0);
      push();
      translate(x * this.scale, y * this.scale);
      rotate(v.heading());
      line(0, 0, this.scale, 0);
      pop();
      //rect(x * this.scale, y * this.scale, this.scale, this.scale);

      // var vector = this.createVector_(angle, 10);
      // this.flowfield[x + y * this.columns] = vector;
      for(var i=0; i < Moai.particles.length; i++){
        Moai.particles[i].update();
        Moai.particles[i].show();
      }
    }
    this.y += this.yIncrement;
    this.z += this.zIncrement;
  }
};

Moai.Flowfield.prototype.showFlowfield_ = function(vector) {
  // stroke(0, 255);
  // push();
  // translate(x * this.scale, y * this.scale);
  // rotate(vector.heading());
  // strokeWeight(1);
  // line(0, 0, 10, 0);
  // pop();
};

Moai.Flowfield.prototype.drawParticles = function() {
  this.showFlowfield_();
  for (var i = 0; i < Moai.particles.length; i++) {
    Moai.particles[i].follow(this.flowfield);
    Moai.particles[i].update_();
    Moai.particles[i].edges();
    Moai.particles[i].show();
  }
};
