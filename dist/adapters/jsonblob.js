"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var single_memory_load_base_1 = require("./single-memory-load-base");
function createJSONDataSource(store, content) {
    var storedData = JSON.parse(content);
    var adapter = new single_memory_load_base_1.SinglyLoadedMemoryDataSource(storedData, store);
    var createAction = actions_1.createAddDataSourceAction("jsonblob", {}, {}, adapter);
    adapter.id = createAction.payload.id;
    store.dispatch(createAction);
    return adapter;
}
exports.createJSONDataSource = createJSONDataSource;
