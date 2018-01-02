'use strict';

var App = require('../app');

var Debug = function(/* arguments */) { //debugger;
  if(App.debug) {
    var prints = Array.from(arguments);
  
    prints.map(function(item, i) {
      if(typeof arguments !== 'undefined') {
        var print = typeof item === 'object' 
          ? JSON.stringify(item) 
          : item
        
          console.log(i, print);
      };
    });
  };
};

module.exports = Debug;