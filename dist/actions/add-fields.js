"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var id = 0;
function createAddFieldsAction(fields) {
    return { type: "ADD_FIELDS", payload: { fields: fields.map(function (f) { return ({ name: f.name, dataSource: f.dataSource, table: f.table, id: (id++) }); }) } };
}
exports.createAddFieldsAction = createAddFieldsAction;
