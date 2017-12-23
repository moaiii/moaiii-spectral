var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'moai',
    song_video: 'video/index.mp4',
    headline: 'Whats the world with no soul?'
  });
});

module.exports = router;
