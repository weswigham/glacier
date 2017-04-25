import {ReduxStandardAction} from "./";
import {FieldId} from "../model";

export type AddJoinAction = ReduxStandardAction<"ADD_JOIN", {left: FieldId, right: FieldId}>;

export function createAddJoinAction(left: FieldId, right: FieldId): AddJoinAction {
    return {type: "ADD_JOIN", payload: {left, right}};
}