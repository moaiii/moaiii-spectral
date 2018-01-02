'use-strict';

// const argv = require('yargs').argv

var App = {
  debug: process.env.DEBUG === 'true' ? true : false,
  spectrums: [],
  song: null
};

module.exports = App;