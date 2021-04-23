const { src, dest, watch, parallel } = require("gulp");
//const sass = require("gulp-sass");
//const autoprefixer = require("autoprefixer");
//const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
//const cssnano = require("cssnano");
const concat = require("gulp-concat");
const terser = require("gulp-terser-js");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const cache = require("gulp-cache");
const webp = require("gulp-webp");

const paths = {
    scss: "src/scss/**/*.scss",
    js: "src/js/**/*.js",
    images: "src/img/**/*",
};

// css es una función que se puede llamar automaticamente
/* function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        // .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('./build/css') );
} */

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat("bundle.js")) // final output file name
        .pipe(terser())
        .pipe(sourcemaps.write("."))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("./build/js"));
}

function images() {
    return src(paths.images)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest("build/img"))
        .pipe(notify({ message: "Imagen Completada" }));
}

function toWebp() {
    return src(paths.images)
        .pipe(webp())
        .pipe(dest("build/img"))
        .pipe(notify({ message: "Imagen Completada" }));
}

function watchFiles() {
    //watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.images, images);
    watch(paths.images, toWebp);
}

//exports.css = css;
exports.watchFiles = watchFiles;
exports.default = parallel(
    //css,
    javascript,
    images,
    toWebp,
    watchFiles
);
