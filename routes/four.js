var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('four', {
    title: 'four',
    song_video: 'video/four.mp4',
    song_name: 'four',
    song_previous: 'three',
    song_next: 'five'
  });
});

module.exports = router;
