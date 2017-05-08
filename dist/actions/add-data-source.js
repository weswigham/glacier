"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var id = 0;
function createAddDataSourceAction(type, metadata, cache, adapter) {
    return { type: "ADD_DATA_SOURCE", payload: { type: type, metadata: metadata, cache: cache, id: (id++), adapter: adapter } };
}
exports.createAddDataSourceAction = createAddDataSourceAction;
