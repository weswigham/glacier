"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createRemoveFieldsAction(fields) {
    return { type: "REMOVE_FIELDS", payload: { fields: fields } };
}
exports.createRemoveFieldsAction = createRemoveFieldsAction;
function createRemoveFieldsByIdAction(fields) {
    return { type: "REMOVE_FIELDS_BY_ID", payload: { fields: fields } };
}
exports.createRemoveFieldsByIdAction = createRemoveFieldsByIdAction;
