var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    meta   = require('./package.json');

var srcDir = './src/',
    jsDir = './web/js/',
    cssDir = './web/css/',
    expose = [
        './bower_components/almond/almond.js',
        './bower_components/paper/dist/paper-full.min.js',
    ],
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

gulp.task('expose', function() {
    gulp.src(expose)
        .pipe(concat('dependencies.js'))
        .pipe(gulp.dest(jsDir));
});

gulp.task('full', function() {
    gulp.src(vendors.concat([srcDir + '**/*.js']))
        .pipe(concat(meta.name + '.js'))
        .pipe(uglify())
        .pipe(header(banner, meta))
        .pipe(gulp.dest(jsDir));
});

gulp.task('min', function(){
    gulp.src(vendors.concat([srcDir + '**/*.js']))
        .pipe(concat(meta.name + '.min.js'))
        .pipe(uglify())
        .pipe(header(banner, meta))
        .pipe(gulp.dest(jsDir));
});

gulp.task('watch', ['dev'], function () {
    gulp.watch(srcDir + '**/*.js', ['dev']);
});

gulp.task('default', ['jshint', 'expose', 'min']);
gulp.task('dev', ['jshint', 'full']);