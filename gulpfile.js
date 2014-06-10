var gulp      = require('gulp'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    header    = require('gulp-header'),
    jshint    = require('gulp-jshint'),
    sass      = require('gulp-sass'),
    rename    = require('gulp-rename'),
    plumber   = require('gulp-plumber'),
    gutil     = require('gulp-util'),
    minifyCSS = require('gulp-minify-css'),
    meta      = require('./package.json');

    var srcDir     = './src/',
        jsDir      = './web/js/',
        cssDir     = './web/css/',
        sassDir    = './src/sass/',
        angularDir = './src/angular/',
        expose     = [
            './bower_components/almond/almond.js',
            './bower_components/paper/dist/paper-full.min.js',
            './bower_components/angular/angular.min.js'
        ],
        recipes    = {
            server: require('./recipes/server.json'),
            client: require('./recipes/client.json')
        },
        banner     = [
          '/*!',
          ' * <%= name %> <%= version %>',
          ' * <%= homepage %>',
          ' * <%= license %>',
          ' */\n\n'
        ].join('\n');

var onError = function (err) {
  gutil.beep();
  console.log(err.toString());
  this.emit('end');
};

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

gulp.task('sass-full', function() {
  gulp.src(sassDir + 'style.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(rename('style.css'))
    .pipe(gulp.dest(cssDir));
});

gulp.task('sass-min', function() {
  gulp.src(sassDir + 'style.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename('style.css'))
    .pipe(gulp.dest(cssDir));
});

gulp.task('angular', function() {
    gulp.src(angularDir + '**/*.js')
        .pipe(concat(angularDir + '**/*.js'))
        .pipe(header(banner, meta))
        .pipe(rename('angular.js'))
        .pipe(gulp.dest(jsDir));

    gulp.src(angularDir + 'fixtures/*.json')
        .pipe(gulp.dest(jsDir + 'fixtures'));
});

gulp.task('watch', ['dev'], function () {
    gulp.watch(['src/**/*.js', "!src/angular/**/*.js"], ['dev']);
    gulp.watch('src/angular/**/*', ['angular']);
    gulp.watch('src/**/*.scss', ['sass-full']);
});

gulp.task('default', ['jshint', 'server', 'front-expose', 'front-min', 'sass-min', 'angular']);
gulp.task('dev', ['jshint', 'server', 'front-full', 'sass-full', 'angular']);
