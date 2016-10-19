glacier
=======

This folder contains the glacier model component of the js frontend for the glimpse application.

Dev Setup
=====

1. `cd` into this folder
2. `npm install`
3. `npm install -g gulp-cli`

If using `vscode` you should open the parent folder of this one to use the project-wide settings. Additionally, you should install the `tslint` extension to get nice lint warnings as you edit.

Build
=====
1. `gulp build` (TODO)

Test
=====
1. `gulp test` or `npm test` (TODO)


Example
=======
In the general case, this library should be usable like the following:
```ts
import {createModel, createSvgExporter, createSqlDataSource} from "glacier";
cosnt model = createModel();
const exporter = createSvgExporter(model);
const source = createSqlDataSource(model, "../path/to/db");
model.subscribe(state => console.log(exporter.export()));
```