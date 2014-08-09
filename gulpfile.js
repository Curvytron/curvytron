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
    nodemon   = require('gulp-nodemon'),
    meta      = require('./package.json');

    var srcDir  = './src/',
        jsDir   = './web/js/',
        cssDir  = './web/css/',
        sassDir = './src/sass/',
        expose  = [],
        dependencies = [
            './bower_components/angular/angular.js',
            './bower_components/angular-route/angular-route.js',
            './bower_components/angular-cookies/angular-cookies.js',
            './bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
            './bower_components/createjs-soundjs/lib/soundjs-0.5.2.min.js',
            './bower_components/tom32i-event-emitter.js/dist/event-emitter.min.js',
            './bower_components/tom32i-option-resolver.js/dist/option-resolver.min.js',
            './bower_components/tom32i-gamepad.js/dist/gamepad.min.js',
            './bower_components/tom32i-key-mapper.js/dist/key-mapper.min.js',
            './bower_components/tom32i-asset-loader.js/dist/asset-loader.min.js'
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
    gulp.src(dependencies)
        .pipe(concat('dependencies.js'))
        .pipe(uglify())
        .pipe(gulp.dest(recipes.client.path));

    for (var i = expose.length - 1; i >= 0; i--) {
        gulp.src(expose[i]).pipe(gulp.dest(recipes.client.path));
    }
});

gulp.task('front-full', function() {
    gulp.src(recipes.client.files)
        .pipe(concat(recipes.client.name))
        .pipe(header(banner, meta))
        .pipe(gulp.dest(recipes.client.path));
});

gulp.task('front-min', function(){
    gulp.src(recipes.client.files)
        .pipe(concat(recipes.client.name))
        .pipe(uglify())
        .pipe(header(banner, meta))
        .pipe(gulp.dest(recipes.client.path));
});

gulp.task('views', function(){
    gulp.src('src/client/views/**/*')
        .pipe(gulp.dest(jsDir + 'views'));
});

gulp.task('server', function() {
    gulp.src(recipes.server.files)
        .pipe(concat(recipes.server.name))
        .pipe(gulp.dest(recipes.server.path));
});

gulp.task('nodemon', function () {
    nodemon({
        watch: recipes.server.files,
        ext: 'js',
        script: 'bin/curvytron.js',
        restartable: "rs"
    })
    .on('change', ['server', 'front-expose', 'front-full'])
    .on('restart', ['default'])
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

gulp.task('watch', ['dev'], function () {
    gulp.watch('src/**/*.js', ['jshint', 'server', 'front-full']);
    gulp.watch('src/client/views/**/*', ['views']);
    gulp.watch('src/**/*.scss', ['sass-full']);
});

gulp.task('default', ['jshint', 'server', 'front-expose', 'views', 'front-min', 'sass-min']);
gulp.task('dev', ['jshint', 'server', 'front-expose', 'views', 'front-full', 'sass-full']);
