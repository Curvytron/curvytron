var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    meta   = require('./package.json');

var srcDir = './src/',
    distDir = './dist/',
    vendors = [
        './bower_components/tom32i-event-emitter.js/dist/event-emitter.min.js',
        './bower_components/tom32i-option-resolver.js/dist/option-resolver.min.js'
    ]
    banner = [
      '/*!',
      ' * <%= name %> <%= version %>',
      ' * <%= homepage %>',
      ' * <%= license %>',
      ' */\n\n'
    ].join('\n');

gulp.task('jshint', function() {
    gulp.src(srcDir + '**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('full', function() {
    gulp.src(vendors.concat([srcDir + '**/*.js']))
        .pipe(concat(meta.name + '.js'))
        .pipe(uglify())
        .pipe(header(banner, meta))
        .pipe(gulp.dest(distDir));
});

gulp.task('min', function(){
    gulp.src(vendors.concat([srcDir + '**/*.js']))
        .pipe(concat(meta.name + '.min.js'))
        .pipe(uglify())
        .pipe(header(banner, meta))
        .pipe(gulp.dest(distDir));
});

gulp.task('watch', ['default'], function () {
    gulp.watch(srcDir + '**/*.js', ['default']);
});

gulp.task('default', ['jshint', 'full', 'min']);