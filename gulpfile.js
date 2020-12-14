const gulp = require("gulp"),
  svgSprite = require("gulp-svg-sprite"),
  svgmin = require("gulp-svgmin"),
  cheerio = require("gulp-cheerio");

gulp.task("gulp-svg", function() {
  return gulp
    .src("src/svg-sprite/**/*.svg")
    .pipe(
      svgmin({
        plugins: [
          { removeDoctype: true },
          { removeComments: true },
          { removeStyleElement: true },
          { removeXMLNS: true },
          { removeDimensions: true },
          { collapseGroups: true }
        ],
        js2svg: { pretty: true }
      })
    )
    .pipe(
      cheerio({
        run: function($) {
          $("[data-name]").removeAttr("data-name");
          $("[class]").removeAttr("class");
          $("path[id]").removeAttr("id");
          $("[style]").removeAttr("style");
        },
        parserOptions: { xmlMode: true }
      })
    )
    .pipe(
      svgSprite({
        mode: {
          symbol: { sprite: "../sprite.svg" }
        }
      })
    )
    .pipe(gulp.dest("src/static/img"));
});

gulp.task("gulp-watch", function() {
  gulp.watch("src/svg-sprite/**/*.svg", gulp.parallel("gulp-svg"));
});

gulp.task("default", gulp.parallel("gulp-watch", "gulp-svg"));
