import rootGulp = require("gulp");
import helper = require("gulp-help");
import ws = require("webpack-stream");
import webpack = require("webpack");
import mocha = require("gulp-mocha");

const gulp = helper(rootGulp);


function createBuildStream(release?: boolean) {
  return gulp.src("src/index.ts")
    .pipe(ws({
      output: {
        filename: release ? "glacier.min.js" : "glacier.js",
      },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
        },
        module: {
            loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
            ]
        },
        plugins: release ? [new webpack.optimize.UglifyJsPlugin()] : []
    }))
    .pipe(gulp.dest(release ? "dist/" : "dist/local/"));
}

gulp.task("build", "Compiles all typescript code and bundles it into a single file in the dist folder", [], () => {
    return createBuildStream();
});

gulp.task("build-release", "Does a 'build' with minification enabled", [], () => {
    return createBuildStream(/*release*/true);
});

gulp.task("build-test", "Compiles a test bundle from the test ts sources and the library ts", [], () => {
  return gulp.src(["src/index.ts", "src/test/**/*.ts"])
    .pipe(ws({
      output: {
        filename: "test.glacier.js",
      },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
        },
        module: {
            loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
            ]
        },
    }))
    .pipe(gulp.dest("dist/local/"));
});

gulp.task("test", "Executes the test suite", ["build-test"], () => {
    return gulp.src("dist/local/test.glacier.js", {read: false})
        .pipe(mocha({reporter: "spec"}));
});

gulp.task("release", "Runs tests and builds a release", ["test", "build-release"]);

gulp.task("default", ["test"]);