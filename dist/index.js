"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./model"));
__export(require("./actions"));
__export(require("./mapper"));
var redux_1 = require("redux");
var allReducers = require("./reducers");
exports.reducer = redux_1.combineReducers(allReducers);
function createModel() {
    return redux_1.createStore(exports.reducer);
}
exports.createModel = createModel;
__export(require("./adapters"));
__export(require("./exporters"));
