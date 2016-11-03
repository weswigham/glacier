"use strict";
var DemonstrateScopingProblems = (function () {
    function DemonstrateScopingProblems() {
        this.status = "blah";
        this.run = function () {
        };
    }
    return DemonstrateScopingProblems;
}());
var glacier = require("glacier");
console.log("test");
// var model = glacier.createModel();
// var adapter = glacier.createSqlFileDataSource(model, "../../data/CycleChain.sqlite");
// var exporter = glacier.createSvgExporter(model);
// // TODO: Update this example to appropriately insert encodings once encodings are held within the store
// var unsubscribe = model.subscribe(function () { return exporter.export().then(function (value) {
//     console.log(value);
//     unsubscribe();
//     adapter.remove();
// }).catch(function (err) { return console.log(err); }); });
// adapter.updateCache();
//# sourceMappingURL=app.js.map