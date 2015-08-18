var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

gulp.task()

gulp.task('clean', function (cb) { del(['dist/**'], cb); });

gulp.task('less', ['clean'], function () {
  return gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('src/app/css'));
});

gulp.task('minify', ['less'], function() {
  return gulp.src('src/app/css/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('src/app/css'));
});

gulp.task('copy', ['minify'], function() {
  return gulp.src('src/app/**')
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'less', 'copy']);
