var gulp = require('gulp');
var server = require('gulp-express');
var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var jsValidate = require('gulp-jsvalidate');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var scss = require('postcss-scss');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');

gulp.task('server',function(){
  nodemon({
    'script': 'app.js',
  });
});

gulp.task('watch', function() {
  gulp.watch('views/**/*.ejs', ['ejs']);
  gulp.watch('public/sass/**/*.scss', ['styles']);
  // gulp.watch('public/javascripts/**/*.js', ['scripts']);
});

gulp.task('validate-js', function(){
  return gulp.src('public/javascripts/*.js')
  .pipe(jsValidate());
});

gulp.task('ejs',function(){
  return gulp.src('views/**/*.ejs')
  .pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src('public/sass/base.scss')
  .pipe(sass())
  .pipe(gulp.dest('public/stylesheets'));
});

// gulp.task('scripts', function() {
//   return gulp.src('public/javascripts/**/*.js')
//   .pipe(jshint.reporter('default'))
//   .pipe(livereload());
// });

gulp.task('default', ['validate-js', 'styles', 'watch']);
