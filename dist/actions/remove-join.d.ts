import { ReduxStandardAction } from "./";
import { FieldId } from "../model";
export declare type RemoveJoinAction = ReduxStandardAction<"REMOVE_JOIN", {
    left: FieldId;
    right: FieldId;
}>;
export declare function createRemoveJoinAction(left: FieldId, right: FieldId): RemoveJoinAction;
