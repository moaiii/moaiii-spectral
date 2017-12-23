Moai.Particle = function() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxSpeed = 4;
  this.h = 0;
  this.scale = 10;
  this.prevPos = this.pos.copy();
};

Moai.Particle.prototype.update = function() {
  this.vel.add(this.acc);
  this.vel.limit(this.maxspeed);
  this.pos.add(this.vel);
  this.acc.mult(0);
};

Moai.Particle.prototype.follow = function(vectors) {
  var x = floor(this.pos.x / this.scale);
  var y = floor(this.pos.y / this.scale);
  var index = x + y * Moai.flowfield.columns;
  var force = vectors[index];
  this.applyForce(force);
};

Moai.Particle.prototype.applyForce = function(force) {
  this.acc.add(force);
};

Moai.Particle.prototype.show = function() {
  stroke(0);
  ellipse(this.pos.x, this.pos.y, 5);
  // if (this.h > 255) this.h = 0;
  // strokeWeight(1);
  // line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
  // this.updatePrev_();
};

Moai.Particle.prototype.edges = function() {
  if (this.pos.x > width) {
    this.pos.x = 0;
    this.updatePrev_();
  }
  if (this.pos.x < 0) {
    this.pos.x = width;
    this.updatePrev_();
  }
  if (this.pos.y > height) {
    this.pos.y = 0;
    this.updatePrev_();
  }
  if (this.pos.y < 0) {
    this.pos.y = height;
    this.updatePrev_();
  }
};

Moai.Particle.prototype.updatePrev_ = function() {
  this.prevPos.x = this.pos.x;
  this.prevPos.y = this.pos.y;
};
