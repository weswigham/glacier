import { ReduxStandardAction } from "./";
import { Field, FieldId } from "../model";
export declare type RemoveFieldsAction = ReduxStandardAction<"REMOVE_FIELDS", {
    fields: Field[];
}>;
export declare type RemoveFieldsByIdAction = ReduxStandardAction<"REMOVE_FIELDS_BY_ID", {
    fields: FieldId[];
}>;
export declare function createRemoveFieldsAction(fields: Field[]): RemoveFieldsAction;
export declare function createRemoveFieldsByIdAction(fields: FieldId[]): RemoveFieldsByIdAction;
