import rootGulp = require("gulp");
import helper = require("gulp-help");
import ws = require("webpack-stream");
import webpack = require("webpack");
import mocha = require("gulp-mocha");
import gulpts = require("gulp-typescript");
import mergeStreams = require("merge2");

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
            { test: /\.json$/, loader: "json-loader" },
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }
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
    const project = gulpts.createProject("./src/tsconfig.json", {typescript: require("typescript")});
    const streams = project.src()
            .pipe(project(gulpts.reporter.fullReporter(true)));
    return mergeStreams(
            streams.js.pipe(gulp.dest("./dist")),
            streams.dts.pipe(gulp.dest("./dist")),
        /*createBuildStream(/*release/true)*/
    );
});

gulp.task("test", "Executes the test suite", ["build"], () => {
    return gulp.src("src/test/**/*.ts", {read: false})
        .pipe(mocha({reporter: "spec"}));
});

gulp.task("release", "Runs tests and builds a release", ["test", "build-release"]);

gulp.task("default", ["test"]);
