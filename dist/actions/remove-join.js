"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createRemoveJoinAction(left, right) {
    return { type: "REMOVE_JOIN", payload: { left: left, right: right } };
}
exports.createRemoveJoinAction = createRemoveJoinAction;
