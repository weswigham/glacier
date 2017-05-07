"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAddJoinAction(left, right) {
    return { type: "ADD_JOIN", payload: { left: left, right: right } };
}
exports.createAddJoinAction = createAddJoinAction;
