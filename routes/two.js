var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('two', {
    title: 'two',
    song_video: 'video/two.mp4',
    song_name: 'two',
    song_previous: 'one',
    song_next: 'three'
  });
});

module.exports = router;
