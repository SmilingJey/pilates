'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var rename = require('gulp-rename');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svgstore = require('gulp-svgstore');
var posthtml = require('gulp-posthtml');
var htmlinclude = require('posthtml-include');
var uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat');
var del = require('del');
var cheerio = require('gulp-cheerio');
var htmlmin = require('gulp-htmlmin');
var zip = require('gulp-zip');
var moment = require('moment');
var excludeGitignore = require('gulp-exclude-gitignore');
var log = require('fancy-log');
var ttf2woff = require('gulp-ttf2woff');
var ttf2woff2 = require('gulp-ttf2woff2');
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");

/************************* CONFIG ************************************/
var scriptsFiles = [
  'source/js/lazysizes.js',
  'source/js/picturefill.js'
];

var svgSpriteImages = [
  'source/img/vk.svg',
  'source/img/instagram.svg',
  'source/img/facebook.svg',
];

/************************** BUILD CSS *********************************/
gulp.task('css', function () {
  var processors = [autoprefixer({
    browsers: ['last 2 version']
  })];
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(csso())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

/************************** BUILD SVG *********************************/
gulp.task('svgclean', function () {
  return del('build/img/**/*.svg');
});

gulp.task('svgcopy', function () {
  return gulp.src([
      'source/img/**/*.svg',
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build/'));
});

gulp.task('svgmin', function () {
  return gulp.src('build/img/**/*.svg')
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('svgsprite', function () {
  return gulp.src(svgSpriteImages)
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('svg', gulp.series('svgclean', 'svgcopy', 'svgmin', 'svgsprite'));

/************************** BUILD IMG **************************************/
gulp.task('imgcopy', function () {
  return gulp.src([
      'source/img/**/*.{png,jpg,gif,webp}',
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build/'));
});

gulp.task('imgmin', function () {
  return gulp.src('build/img/**/*.{png,jpg}')
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.mozjpeg({
        progressive: true
      })
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('webp', function () {
  return gulp.src('build/img/**/*.{png,jpg}')
    .pipe(webp({
      quality: 80
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('img', gulp.series('imgcopy', 'imgmin', 'webp'));

/************************** BUILD HTML **************************************/
gulp.task('html', function () {
  return gulp.src('source/**/*.html')
    .pipe(plumber())
    .pipe(posthtml([
      htmlinclude()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build/'));
});

/************************** BUILD JS ***************************************/
gulp.task('jsclean', function () {
  return del('build/js');
});

gulp.task('jscopy', function () {
  return gulp.src([
      'source/js/**'
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build/'));
});

gulp.task('jsconcat', function (done) {
  return gulp.src(scriptsFiles)
    .pipe(plumber())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('jsmin', function () {
  return gulp.src(['build/js/**/*.js', '!build/js/**/*.min.js'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/js/'));
});

//gulp.task('js', gulp.series('jscopy', 'jsconcat', 'jsmin'));

gulp.task("babel", function () {
  return gulp.src('source/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build/js/"));
});

gulp.task('js', gulp.series('babel'));
/************************** BUILD FONT ***************************************/
gulp.task('copy-woff-fonts', function() {
  return gulp.src(['source/fonts/**/*.{woff,woff2}',], {
    base: 'source'
  })
  .pipe(gulp.dest('build/'));
});

gulp.task('ttf2woff', function() {
  return gulp.src(['source/fonts/**/*.ttf',], {
      base: 'source'
    })
    .pipe(ttf2woff())
    .pipe(gulp.dest('build/'));
});

gulp.task('ttf2woff2', function(){
  return gulp.src(['source/fonts/**/*.ttf',], {
      base: 'source'
    })

    .pipe(ttf2woff2())
    .pipe(gulp.dest('build/'));
});

gulp.task('ttf2woff_source', function(){
  return gulp.src(['source/fonts/**/*.ttf',], {
      base: 'source'
    })
    .pipe(ttf2woff())
    .pipe(gulp.dest('source/'));
});

gulp.task('ttf2woff2_source', function(){
  return gulp.src(['source/fonts/**/*.ttf',], {
      base: 'source'
    })
    .pipe(ttf2woff2())
    .pipe(gulp.dest('source/'));
});

gulp.task('font2woff', gulp.series('ttf2woff_source', 'ttf2woff2_source'));
gulp.task('fonts', gulp.series('copy-woff-fonts'/*, 'ttf2woff', 'ttf2woff2'*/));

/**************************** CLEAN *****************************************/
gulp.task('clean', function () {
  return del('build');
});

gulp.task('clean-no-img', function () {
  return del(['build/**/*', '!build/img', '!build/img/**.*']);
});

/************************** LIVE RELOAD *************************************/
gulp.task('reloadPage', function (done) {
  server.reload();
  done();
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/**/*.html').on('change', gulp.series('html', 'reloadPage'));
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/js/**/*.js').on('change', gulp.series('js', 'reloadPage'));
  gulp.watch('source/img/**/*.svg', gulp.series('svg', 'html', 'reloadPage'));
});

gulp.task('build', gulp.series('clean', 'fonts', 'img', 'svg', 'html', 'css', 'js'));
gulp.task('build-no-img', gulp.series('clean-no-img', 'fonts', 'svg', 'html', 'css', 'js'));
gulp.task('start', gulp.series('build-no-img', 'server'));

/************************** BACKUP *************************************/
gulp.task('backup', function () {
    var currentDate = moment().format('YYYY-MM-DD HH_mm');
    var folderName = __dirname.substring(__dirname.lastIndexOf('\\')+1);
    var backUpName = folderName + " " + currentDate + '.zip';
    var copyPath = 'd:/GoogleDrive/backup/';
    return gulp.src(['./*.*','source/**'], {base: './'})
        //.pipe(excludeGitignore())
        .pipe(zip(backUpName))
        .pipe(gulp.dest('backup/'))
        .pipe(gulp.dest(copyPath))
        .on('end', () => log('Backup done! File name ' + backUpName));
});
