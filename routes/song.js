var express = require('express');
var router = express.Router();
const data = require('../public/data/songs');

module.exports = function(req, res) { 
  
  let id = parseInt(req.params.id);
  let sumSongs = data.length;

  let current = data[id];

  let previous = data[id - 1];
  let previous_url = (id - 1);
  
  let next = (1 + id) === sumSongs ? data[0] : data[1 + id]; // circular
  let next_url = (1 + id) === sumSongs ? 1 : (1 + id); // circular

  res.render('song', {
    song_name:               data[id].name,
    song_video:             `video/${current.name}.mp4`,
    song_previous_url:      `/song/${previous_url}`,
    song_previous_name:     `/${previous.name}`,
    song_next_url:          `/song/${next_url}`,
    song_next_name:         `/${next.name}`
  });
};