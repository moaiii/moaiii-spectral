var getIndex = function() {
  return window.location.pathname.length === 1 
    ? 'index'
    : window.location.pathname.slice(6, window.location.pathname.length); // num  
};

module.exports = getIndex;