import { ReduxStandardAction } from "./";
import { FieldId } from "../model";
export declare type AddJoinAction = ReduxStandardAction<"ADD_JOIN", {
    left: FieldId;
    right: FieldId;
}>;
export declare function createAddJoinAction(left: FieldId, right: FieldId): AddJoinAction;
