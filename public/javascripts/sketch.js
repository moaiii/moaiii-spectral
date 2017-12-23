function draw() {
  clear();
  background('rgba(255, 255, 255, 0)');

  Moai.song.setWaveform();

  for(var i = 0; i < Moai.animators.length; i++) {
    Moai.animators[i].setFramecount(frameCount);
    Moai.animators[i].animation();
  }

  for(var j = 0; j < Moai.spectrums.length; j++) {
    Moai.spectrums[j].draw();
  }

  if(Moai.flowfield) {
    Moai.flowfield.draw();
  }

}
