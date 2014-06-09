var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    meta   = require('./package.json');

var srcDir = './src/',
    frontDir = './web/js/',
    serverDir = './bin/',
    cssDir = './web/css/',
    expose = [
        './bower_components/almond/almond.js',
        './bower_components/paper/dist/paper-full.min.js',
    ],
    frontVendors = [
        './bower_components/tom32i-event-emitter.js/dist/event-emitter.min.js',
        './bower_components/tom32i-option-resolver.js/dist/option-resolver.min.js'
    ],
    serverVendors = [
        './bower_components/tom32i-option-resolver.js/dist/option-resolver.min.js'
    ],
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

gulp.task('front-expose', function() {
    gulp.src(expose)
        .pipe(concat('dependencies.js'))
        .pipe(gulp.dest(frontDir));
});

gulp.task('front-full', function() {
    gulp.src(frontVendors.concat([
            srcDir + 'shared/**/*.js',
            srcDir + 'client/**/*.js'
        ]))
        .pipe(concat(meta.name + '.js'))
        .pipe(header(banner, meta))
        .pipe(gulp.dest(frontDir));
});

gulp.task('front-min', function(){
    gulp.src(frontVendors.concat([
            srcDir + 'shared/**/*.js',
            srcDir + 'client/**/*.js'
        ]))
        .pipe(concat(meta.name + '.js'))
        .pipe(uglify())
        .pipe(header(banner, meta))
        .pipe(gulp.dest(frontDir));
});

gulp.task('server', function() {
    gulp.src(serverVendors.concat([
            srcDir + 'shared/**/*.js',
            srcDir + 'server/**/*.js'
        ]))
        .pipe(concat(meta.name + '.js'))
        .pipe(gulp.dest(serverDir));
});

gulp.task('watch', ['dev'], function () {
    gulp.watch(srcDir + '**/*.js', ['dev']);
});

gulp.task('default', ['jshint', 'server', 'front-expose', 'front-min']);
gulp.task('dev', ['jshint', 'server', 'front-full']);