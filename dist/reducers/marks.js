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
function marks(state, action) {
    if (!state)
        return {};
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "UPDATE_MARK": {
            switch (action.payload.settingName) {
                case "desc": {
                    return __assign({}, state, { description: action.payload.settingValue });
                }
                case "size": {
                    return __assign({}, state, { width: action.payload.settingValue.width, height: action.payload.settingValue.height });
                }
                case "markType": {
                    return __assign({}, state, { mark: action.payload.settingValue });
                }
                default: return state;
            }
        }
        default: return state;
    }
}
exports.marks = marks;
