import {ReduxStandardAction} from "./";
import {Field} from "../model";

export type RemoveFieldsAction = ReduxStandardAction<"REMOVE_FIELDS", {fields: Field[], dataSource: string}>;

export function createRemoveFieldsAction(fields: Field[], dataSource: string): RemoveFieldsAction {
    return {type: "REMOVE_FIELDS", payload: {fields, dataSource}};
}