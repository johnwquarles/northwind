var gulp = require('gulp'),
    lr = require('tiny-lr')(),
    chalk = require('chalk'),
    $    = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'del', 'main-bower-files']
    }),
    LRPORT = 35729;

gulp.task('clean', function (cb) {
  $.del(['public/js/*.js', 'public/css/*.css', 'public/lib/*.js', 'public/lib/*.css'])
   .then(function () {cb()})
   .catch(function (err) {console.log(err);});
})

gulp.task('sass', function () {
  gulp
    .src('views/sass/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe($.autoprefixer({
       browsers: ['> 1%'],
       cascade: true
     }))
    .pipe(gulp.dest('./public/css'))
});

gulp.task('babel', function () {
  gulp
    .src('views/js/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      sourceMaps: 'inline'
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./public/js'))
})

gulp.task('bower', function() {
  gulp
    .src($.mainBowerFiles('**/*.js'))
    .pipe($.concat('build.js'))
    .pipe(gulp.dest('./public/lib'));
  gulp
    .src('bower_components/**/*.css')
    .pipe($.concat('build.css'))
    .pipe($.cssmin())
    .pipe(gulp.dest('./public/lib'));
});

gulp.task('watch', function () {
  gulp.watch(['views/**/*.scss'], ['sass']);
  gulp.watch(['views/**/*.js'], ['babel']);
  gulp.watch(['public/**/*', 'views/**/*'], liveReload);
});

gulp.task('compile', ['clean'], function () {
  gulp.start(['bower', 'babel', 'sass', 'watch']);
});

gulp.task('default', ['compile'], function(){
  $.nodemon({script: 'index.js'});
  lr.listen(LRPORT, function () {
      console.log(chalk.magenta('    === === LiveReload listening on port ' + LRPORT + ' === ===    '));
    })
  setTimeout(function () {
    gulp.src('').pipe($.open(
      {uri: 'http://localhost:3000'}
    ))
  }, 3000);
});

function liveReload(event) {
  console.log(chalk.magenta(' === Livereloading on: ' + event.path + ' === '));
  var fileName = require('path').relative(__dirname, event.path);
  lr.changed({body: {files: [fileName]}});
}
