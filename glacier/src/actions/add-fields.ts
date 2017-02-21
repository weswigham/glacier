import {ReduxStandardAction} from "./";
import {Field, FieldDescriptor, FieldId} from "../model";

export type AddFieldsAction = ReduxStandardAction<"ADD_FIELDS", {fields: FieldDescriptor[]}>;

let id = 0;

export function createAddFieldsAction(fields: Field[]): AddFieldsAction {
    return {type: "ADD_FIELDS", payload: {fields: fields.map(f => ({name: f.name, dataSource: f.dataSource, table: f.table, id: (id++) as FieldId}))}};
}