import {ReduxStandardAction} from "./";
import {Field} from "../model";

export type AddFieldsAction = ReduxStandardAction<"ADD_FIELDS", {fields: Field[], dataSource: string}>;

export function createAddFieldsAction(fields: Field[], dataSource: string): AddFieldsAction {
    return {type: "ADD_FIELDS", payload: {fields, dataSource}};
}