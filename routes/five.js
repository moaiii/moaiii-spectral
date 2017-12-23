var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('five', {
    title: 'five',
    song_video: 'video/five.mp4',
    song_name: 'five',
    song_previous: 'four',
    song_next: 'one'
  });
});

module.exports = router;
