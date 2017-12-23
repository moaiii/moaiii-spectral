var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('three', {
    title: 'three',
    song_video: 'video/three.mp4',
    song_name: 'three',
    song_previous: 'two',
    song_next: 'four'
  });
});

module.exports = router;
