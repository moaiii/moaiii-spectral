var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'SPECTRAL',
    headline: 'moai',
    song_video: '/public/video/index.mp4'
  });
});

module.exports = router;