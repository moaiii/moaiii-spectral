var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('one', {
    title: 'one',
    song_video: 'video/one.mp4',
    song_name: 'one',
    song_previous: '/',
    song_next: 'two'
  });
});

module.exports = router;
