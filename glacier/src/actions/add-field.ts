import {ReduxStandardAction} from "./";
import {Field} from "../model";

export type AddFieldAction = ReduxStandardAction<"ADD_FIELD", Field[]>;

export function createAddFieldAction(fields: Field[]): AddFieldAction {
    return {type: "ADD_FIELD", payload: fields};
}