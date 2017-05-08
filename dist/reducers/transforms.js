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
function transforms(state, action) {
    if (!state) {
        return { joins: [], post_filter: undefined };
    }
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "ADD_JOIN": {
            return __assign({}, state, { joins: state.joins.concat([action.payload]) });
        }
        case "REMOVE_JOIN": {
            var joins = state.joins.filter(function (j) { return !(j.left === action.payload.left && j.right === action.payload.right); });
            if (joins.length === state.joins.length) {
                throw new Error("Attempted to remove a join which does not exist in the state.");
            }
            return __assign({}, state, { joins: joins });
        }
        case "SET_FILTER": {
            return __assign({}, state, { post_filter: action.payload });
        }
        default: return state;
    }
}
exports.transforms = transforms;
