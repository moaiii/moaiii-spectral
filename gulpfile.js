var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var jsValidate = require('gulp-jsvalidate');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var scss = require('postcss-scss');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var config = require('./config');


gulp.task('watch', function() {
  if(process.env.ENV === 'development') {
    gulp.watch('./views/**/*.ejs', ['ejs']);
    gulp.watch('./public/css/sass/**/*.scss', ['styles']);
    gulp.watch('./public/js/bundle.js', ['scripts']);
  } else {
    console.error('Gulp can only run watch in development mode');
  }
});

gulp.task('validate-js', function(){
  if(process.env.ENV === 'development') {
    return gulp
      .src('./public/js/modules/*.js')
      .pipe(jsValidate());
  } else {
    console.error('Gulp can only run validate-js in development mode');
  }
});
  
gulp.task('ejs', function() {
  if(process.env.ENV === 'development') {
    return gulp
      .src('./views/**/*.ejs')
      .pipe(livereload());
  } else {
    console.error('Gulp can only run ejs in development mode');
  }
});
  
gulp.task('scripts', function() {
  if(process.env.ENV === 'development') {
    return gulp
      .src('./public/js/modules/*.js')
      .pipe(jshint.reporter('default'))
  } else {
    console.error('Gulp can only run scripts in development mode');
  }
});

gulp.task('styles', function() {
  return gulp.src('./public/css/sass/base.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.' + config.path + 'css'));
});

gulp.task('default', ['validate-js', 'styles', 'scripts', 'watch']);
gulp.task('production', ['styles']);
