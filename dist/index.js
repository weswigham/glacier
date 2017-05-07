"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./model"));
__export(require("./actions"));
__export(require("./mapper"));
var redux_1 = require("redux");
var reducers = require("./reducers");
function createModel() {
    return redux_1.createStore(redux_1.combineReducers(reducers));
}
exports.createModel = createModel;
__export(require("./adapters"));
__export(require("./exporters"));
