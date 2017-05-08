"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createRemoveDataSourceAction(id) {
    return { type: "REMOVE_DATA_SOURCE", payload: { id: id } };
}
exports.createRemoveDataSourceAction = createRemoveDataSourceAction;
