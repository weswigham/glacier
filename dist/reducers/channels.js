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
function channels(state, action) {
    if (!state) {
        return {};
    }
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "ADD_CHANNEL": {
            if (state[action.payload.kind])
                throw new Error("Channel " + action.payload.kind + " already set!");
            return __assign({}, state, (_a = {}, _a[action.payload.kind] = action.payload.value, _a));
        }
        case "REMOVE_CHANNEL": {
            if (!state[action.payload.kind])
                throw new Error("Channel " + action.payload.kind + " does not exist!");
            var newState = __assign({}, state);
            delete newState[action.payload.kind];
            return newState;
        }
        case "UPDATE_CHANNEL": {
            if (!state[action.payload.kind])
                throw new Error("Channel " + action.payload.kind + " does not exist!");
            return __assign({}, state, (_b = {}, _b[action.payload.kind] = action.payload.value, _b));
        }
        default: return state;
    }
    var _a, _b;
}
exports.channels = channels;
