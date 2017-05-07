"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAddChannelAction(kind, value) {
    return { type: "ADD_CHANNEL", payload: { kind: kind, value: value } };
}
exports.createAddChannelAction = createAddChannelAction;
function createRemoveChannelAction(kind) {
    return { type: "REMOVE_CHANNEL", payload: { kind: kind } };
}
exports.createRemoveChannelAction = createRemoveChannelAction;
function createUpdateChannelAction(kind, value) {
    return { type: "UPDATE_CHANNEL", payload: { kind: kind, value: value } };
}
exports.createUpdateChannelAction = createUpdateChannelAction;
