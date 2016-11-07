var gulp = require('gulp')
var watch = require('gulp-watch') // eslint-disable-line
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('browserjswatch', function () {
  gulp.watch(['public/js/main.js', 'public/js/functions.js'], ['browserjscomp'])
})

gulp.task('browserjscomp', function () {
  return browserify('public/js/main.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/js/'))
})

gulp.task('csswatch', function () {
  gulp.watch('public/css/main.scss', ['csscomp', 'sourcemapcomp'])
})

gulp.task('csscomp', function () {
  return gulp.src('public/css/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'))
})

gulp.task('sourcemapcomp', function () {
  return gulp.src('public/css/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/css'))
})

gulp.task('build', ['browserjscomp', 'csscomp', 'sourcemapcomp'])
gulp.task('start', ['browserjswatch', 'browserjscomp', 'csswatch', 'csscomp', 'sourcemapcomp'])
