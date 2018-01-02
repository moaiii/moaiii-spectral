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


gulp.task('watch', function() {
  gulp.watch('views/**/*.ejs', ['ejs']);
  gulp.watch('public/stylesheets/sass/**/*.scss', ['styles']);
  gulp.watch('public/js/bundle.js', ['scripts']);
});

gulp.task('validate-js', function(){
  return gulp.src('public/js/modules/*.js')
  .pipe(jsValidate());
});

gulp.task('ejs', function(){
  return gulp.src('views/**/*.ejs')
  .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src('public/js/modules/*.js')
  .pipe(jshint.reporter('default'))
  .pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src('public/stylesheets/sass/base.scss')
  .pipe(sass())
  .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('default', ['validate-js', 'styles', 'watch']);
