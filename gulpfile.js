'use strict';

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.sass())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('extras', function () {
  return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
      .pipe(gulp.dest('dist'));
});

gulp.task('build', ['html', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components',
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['build'], function () {
    // watch for changes
    gulp.watch(['app/styles/**/*.scss', 'app/scripts/**/*.js', 'app/*'], ['build']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('server', ['watch'], function () {
  $.nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['node_modules/*']
  }).on('restart', function () {
    console.log('restarted!');
  });
});

gulp.task('test', function (cb) {
  process.env.NODE_ENV = 'test';
  gulp.src(['lib/**/*.js'])
      .pipe($.istanbul()) // Covering files
      .on('finish', function () {
        gulp.src(['test/**/*.js'])
            .pipe($.mocha())
            .pipe($.istanbul.writeReports()) // Creating the reports after tests runned
            .on('end', function() {
              if (process.env.COVERALLS_REPO_TOKEN) { // Sends coverage information to coveralls.
                gulp.src('./coverage/lcov.info')
                    .pipe($.coveralls())
                    .on('end', cb);
              } else {
                cb();
              }
            });
      });
});
