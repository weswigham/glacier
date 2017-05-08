"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alasql = require("alasql");
var actions_1 = require("../actions");
var single_memory_load_base_1 = require("./single-memory-load-base");
function createCSVDataSource(store, content) {
    var storedData = alasql("SELECT * FROM CSV(?, {headers:true})", [content]);
    var adapter = new single_memory_load_base_1.SinglyLoadedMemoryDataSource(storedData, store);
    var createAction = actions_1.createAddDataSourceAction("rawcsv", {}, {}, adapter);
    adapter.id = createAction.payload.id;
    store.dispatch(createAction);
    return adapter;
}
exports.createCSVDataSource = createCSVDataSource;
