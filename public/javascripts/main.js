var Moai = {
  debug: true,
  spectrums: [],
  song: null,
  bpms: {
    one: 110,
    two: 120,
    three: 120,
    four: 140,
    five: 150
  },
  animators: [],
  flowfield: null,
  particles: []
};

Moai.App = function() {
  this.initApp();
};

Moai.App.prototype.initApp = function() {
  new Moai.Framework();
  new Moai.Animator();
  this.perlinNoiseFlowField();
  // new Moai.Spectrum('small', 'rgb(225, 75, 212)', 200, 1, 0.6, 20);  // color, size, thickness, bounce, morph
  // new Moai.Spectrum('medium', 'rgb(200, 50, 56)', 200, 2, 1, 14);
};

Moai.App.prototype.perlinNoiseFlowField = function() {
  for(var i = 0; i < 300; i++) {
    Moai.particles.push(new Moai.Particle());
  } //particles are created
  Moai.flowfield = new Moai.Flowfield(0.1, 0.1, 0.0005, 20, Moai.particles);
  // flow field has been registered here
};

window.onload = function() {
  Moai.app = new Moai.App();
};
