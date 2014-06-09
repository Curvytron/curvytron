var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    meta   = require('./package.json');

var cssDir = './web/css/',
    expose = [
        './bower_components/almond/almond.js',
        './bower_components/paper/dist/paper-full.min.js',
        './bower_components/angular/angular.min.js'
    ],
    recipes = {
        server: require('./recipes/server.json'),
        client: require('./recipes/client.json')
    },
    banner = [
      '/*!',
      ' * <%= name %> <%= version %>',
      ' * <%= homepage %>',
      ' * <%= license %>',
      ' */\n\n'
    ].join('\n');

gulp.task('jshint', function() {
    gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('front-expose', function() {
    gulp.src(expose)
        .pipe(concat('dependencies.js'))
        .pipe(gulp.dest(recipes.client.path));
});

gulp.task('front-full', function() {
    gulp.src(recipes.client.files)
        .pipe(concat(recipes.client.name))
        .pipe(header(banner, meta))
        .pipe(gulp.dest(recipes.client.path));
});

gulp.task('front-min', function(){
    gulp.src(recipes.client.files)
        .pipe(concat(recipes.client.name ))
        .pipe(uglify())
        .pipe(header(banner, meta))
        .pipe(gulp.dest(recipes.client.path));
});

gulp.task('server', function() {
    gulp.src(recipes.server.files)
        .pipe(concat(recipes.server.name))
        .pipe(gulp.dest(recipes.server.path));
});

gulp.task('watch', ['dev'], function () {
    gulp.watch('src/**/*.js', ['dev']);
});

gulp.task('default', ['jshint', 'server', 'front-expose', 'front-min']);
gulp.task('dev', ['jshint', 'server', 'front-full']);
