var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var cheerio = require('gulp-cheerio');
var gulpJade = require('gulp-jade');


var svgstore = require('gulp-svgstore');
var inject = require('gulp-inject');



gulp.task('jade', ['svgstore'], function () {
  return gulp.src('src/jade/*.jade')
    .pipe(gulpJade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
})



gulp.task('svgstore', function () {
    var svgs = gulp
        .src('src/images/svg/*.svg')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(cheerio({
          run: function ($) {
            $('[fill]').removeAttr('fill');
            $('symbol').attr('fill','currentColor');
          },
          parserOptions: { xmlMode: true }
        }))  
        .pipe(gulp.dest('src/images/svg/'))
        .pipe(svgstore({ inlineSvg: true }));

        function fileContents (filePath, file) {
            return file.contents.toString();
        }

    return gulp
        .src('src/jade/includes/svg.jade')
        .pipe(inject(
            svgs,

            { selfClosingTag: true, transform: fileContents }

            ))
        .pipe(gulp.dest('src/jade/includes/'));
});


gulp.task('default',['jade'], function() {
    gulp.watch(['src/jade/**/*.jade', 'src/images/**/*.svg'], ['jade']);
});