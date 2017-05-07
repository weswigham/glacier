"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function filterState(state, toRemove) {
    var ret = {};
    Object.keys(state).map(function (k) { return +k; }).filter(function (k) { return k !== toRemove; }).forEach(function (key) {
        ret[key] = state[key];
    });
    return ret;
}
function sources(state, action) {
    if (!state)
        return {};
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "ADD_DATA_SOURCE": {
            if (state[action.payload.id])
                throw new Error("Attempted to add data source with id " + action.payload.id + " which already exists in the store.");
            return __assign({}, state, (_a = {}, _a[action.payload.id] = action.payload, _a));
        }
        case "REMOVE_DATA_SOURCE": {
            if (!state[action.payload.id])
                throw new Error("Attempted to remove data source with id " + action.payload.id + " which does not exist in the store.");
            return filterState(state, action.payload.id);
        }
        case "UPDATE_DATA_CACHE": {
            var found = state[action.payload.id];
            if (!found)
                throw new Error("Attempted to update the cached data for data source with id " + action.payload.id + " which did not exist in the store.");
            return __assign({}, state, (_b = {}, _b[action.payload.id] = __assign({}, found, { cache: action.payload.cache }), _b));
        }
        default: return state;
    }
    var _a, _b;
}
exports.sources = sources;
