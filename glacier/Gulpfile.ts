import rootGulp = require("gulp");
import helper = require("gulp-help");
import ws = require("webpack-stream");
import webpack = require("webpack");
import mocha = require("gulp-mocha");
import gulpts = require("gulp-typescript");
import mergeStreams = require("merge2");
import child_process = require("child_process");
import path = require("path");

const gulp = helper(rootGulp);


// add node_modules to path so we don't need global modules, prefer the modules by adding them first
const nodeModulesPathPrefix = path.resolve("./node_modules/.bin/") + path.delimiter;
if (process.env.path !== undefined) {
    process.env.path = nodeModulesPathPrefix + process.env.path;
} else if (process.env.PATH !== undefined) {
    process.env.PATH = nodeModulesPathPrefix + process.env.PATH;
}

gulp.task("lint", "Runs tslint over the typescript within the project", (done) => {
    const proc = child_process.spawn("tslint", [
        "--config", "tslint.json",
        "--exclude", "src/node_modules",
        "Gulpfile.ts",
        "src/*.ts",
        "src/test/*.ts",
        "src/model/*.ts",
        "src/reducers/*.ts",
        "src/exporters/*.ts",
        "src/adapters/*.ts",
        "src/actions/*.ts"
    ], {shell: true, stdio: "inherit"});
    proc.on("close", (code: number) => {
        if (code !== 0) return done!(code);
        done!();
    });
});

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

gulp.task("test", "Executes the test suite", ["lint", "build"], () => {
    return gulp.src("src/test/**/*.ts", {read: false})
        .pipe(mocha({reporter: "spec", timeout: 5000}));
});

gulp.task("release", "Runs tests and builds a release", ["test", "build-release"]);

gulp.task("default", ["test"]);
