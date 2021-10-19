'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify');

/**
 * Sass task
 */
gulp.task('sass', function () {
    return gulp.src('./resources/sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

/**
 * JS task
 */
gulp.task('js', function () {
    return gulp.src('./resources/js/**/*.js')
        .pipe(minify())
        .pipe(gulp.dest('./dist/js'));
});

/**
 * Watch task
 */
gulp.task('watch', function () {
    gulp.watch('./resources/sass/**/*.scss', gulp.series('sass'));
});

/**
 * Default task
 */
gulp.task('default', ['sass', 'js']);