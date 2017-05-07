import { ReduxStandardAction } from "./";
import { Field, FieldDescriptor } from "../model";
export declare type AddFieldsAction = ReduxStandardAction<"ADD_FIELDS", {
    fields: FieldDescriptor[];
}>;
export declare function createAddFieldsAction(fields: Field[]): AddFieldsAction;
