import {ReduxStandardAction} from "./";
import {FieldId} from "../model";

export type RemoveJoinAction = ReduxStandardAction<"REMOVE_JOIN", {left: FieldId, right: FieldId}>;

export function createRemoveJoinAction(left: FieldId, right: FieldId): RemoveJoinAction {
    return {type: "REMOVE_JOIN", payload: {left, right}};
}