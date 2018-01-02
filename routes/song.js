var express = require('express');
var router = express.Router();
var data = require('../public/data/data');
var config = require('../config'); 

module.exports = function(req, res) { 
  
  let id = parseInt(req.params.id);
  
  let sumSongs = data.length;

  let current = data[id];

  let previous = (id - 1) === 0 
    ? data[sumSongs - 1] 
    : data[id - 1]; // circular

  let previous_url = (id - 1) === 0
    ? '/song/' + (sumSongs - 1)
    : '/song/' + (id - 1); // circular;
  
  let next = (1 + id) === sumSongs 
    ? data[1] 
    : data[1 + id]; // circular

  let next_url = (1 + id) === sumSongs 
    ? '/song/' + 1 
    : '/song/' + (1 + id); // circular

  res.render('song', {
    song_name:               data[id].name,
    song_previous_url:      `${previous_url}`,
    song_previous_name:     `${previous.name}`,
    song_next_url:          `${next_url}`,
    song_next_name:         `${next.name}`,
    path:                   config.path
  });
};