require('dotenv').config();

var path = process.env.ENV === 'production'
  ? '/dist/'
  : process.env.ENV === 'development' 
    ? '/public/'
    : console.error('Cannot recognise environment: ', process.env.ENV);

module.exports = {
  path: path
};