'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('jslint', function(){
    return gulp.src(['gulpfile.js', 'lib/jsoniq-grammar.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter())
        .pipe($.jshint.reporter('fail'));
});

gulp.task('default', ['jslint']);
