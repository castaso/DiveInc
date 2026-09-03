var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps");

// Put this after including our dependencies
var paths = {
    styles: {
        src: "public/scss/**/*.scss",
        dest: "public/css"
    }
};

// Sass Task
function style() {
    return (
        gulp
            .src(paths.styles.src)
            // Initialize sourcemaps before compilation starts
            .pipe(sourcemaps.init())
            .pipe(sass())
            .on("error", sass.logError)
            // Use postcss with autoprefixer and compress the compiled file using cssnano
            .pipe(postcss([autoprefixer(), cssnano()]))
            // Now add/write the sourcemaps
            .pipe(sourcemaps.write())
            // Set destination
            .pipe(gulp.dest(paths.styles.dest))
    );
}

// Sass Watch
function watch() {
    gulp.watch(paths.styles.src, style)
}

exports.style = style;
exports.watch = watch;