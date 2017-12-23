function setup() {

  if(Moai.song.songId !== 'index') {
    var spectrumCanvas = createCanvas(windowWidth, windowHeight);
    spectrumCanvas.parent('layer1');

    frameRate(30);

    Moai.song.play();
  }
}
