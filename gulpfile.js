const gulp = require("gulp");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");

function javascriptBuild() {
  return browserify({
    entries: ["public/js/map.js"],
    transform: [
      babelify.configure({ presets: ["@babel/preset-env"] }),
    ],
  })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist/js"));
}

function htmlBuild() {
  return gulp.src(`public/index.html`).pipe(gulp.dest("dist"));
}

exports.build = gulp.parallel(javascriptBuild, htmlBuild);
