# glacier

[![Build Status](https://travis-ci.org/glimpseio/glacier.png)](https://travis-ci.org/glimpseio/glacier)

Dev Setup
=====

1. Install node canvas dependencies as appropriate for [your platform](https://github.com/Automattic/node-canvas/wiki). We use it to generate vizualizations in test.
2. `cd` into this folder
3. `npm install` to get our dependcies - both build time and run time
4. (optional) `npm install -g gulp-cli` to install `gulp` on your path. If you don't, you will not be able to use any `gulp` commands. Use `gulp help` for a list of the available commands for this project.

If using `vscode` you should install the `tslint` extension to get nice lint warnings as you edit.

Build
=====
1. `gulp build`

Test
=====
1. `gulp test` or `npm test` This implicitly runs `build`.

Release
=======
1. `gulp build-release` Builds a minified copy of the repository


Debugging
=========
The project is easiest to debug while running tests within `vscode`. Just add a `vscode` `launch.json` (inside the `.vscode` folder) similar to [this one](https://gist.github.com/weswigham/8b6ddfcb99daa85e095fe1fe82ecd8de), and choose `'Launch'` on the debugging pane. 

Example
=======
In the general case, this library should be usable like the following:
```ts
import {createModel, createSvgExporter, createSqlDataSource} from "glacier";
const model = createModel();
const exporter = createSvgExporter(model);
const source = createSqlDataSource(model, "../path/to/db");
model.subscribe(state => console.log(exporter.export()));
```

Design
======
The library is designed as a store which you can dispatch actions to, and hook up adapters (which can dispatch actions) and exporters (which can listen on state changes) on.
 * `src/actions` - actions creators - this is where functions which produce actions which can be dispatched to the store reside
 * `src/reducers` - state management - this is where actions become new parts of the state; specific reducers are responsible for specific actions which update specific portions of the state
 * `src/model` - contains interfaces that describe the shape of state
 * `src/mapper` - logic which maps our internal state into a Vega-Lite specification object
 * `src/adapters` - contains objects and interfaces specifying how to import data into the state (CSV, JSON, SQL, etc)
 * `src/exporters` - contains objects and interfaces specify how to export a state into something useful (SVG, ZIP, etc)
