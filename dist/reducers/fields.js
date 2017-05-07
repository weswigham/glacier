"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
function fields(state, action) {
    if (!state) {
        return {};
    }
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "ADD_FIELDS": {
            return action.payload.fields.reduce(function (prev, f) {
                if (prev[f.id]) {
                    throw new Error("Attempted to add field which already existed in the state!");
                }
                prev[f.id] = f;
                return prev;
            }, state);
        }
        case "REMOVE_FIELDS": {
            var validFields_1 = action.payload.fields.filter(function (item) { return util_1.satisfies(Object.keys(state).map(function (k) { return state[+k]; }), function (field) { return item.name === field.name && item.table === field.table && item.dataSource === field.dataSource; }); });
            if (validFields_1.length !== action.payload.fields.length)
                throw new Error("Field not in state.");
            return Object.keys(state).map(function (k) { return state[+k]; }).filter(function (item) { return !util_1.satisfies(validFields_1, function (field) { return item.name === field.name && item.table === field.table && item.dataSource === field.dataSource; }); }).reduce(function (prev, f) {
                prev[f.id] = f;
                return prev;
            }, {});
        }
        case "REMOVE_FIELDS_BY_ID": {
            return action.payload.fields.reduce(function (prev, id) {
                if (!prev[id]) {
                    throw new Error("Attempted to remove field which did not exist in the state!");
                }
                delete prev[id];
                return prev;
            }, state);
        }
        default: return state;
    }
}
exports.fields = fields;
