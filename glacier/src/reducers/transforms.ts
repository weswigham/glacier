import { TransformsState } from "../model";
import { AllActions } from "../actions";

export function transforms(state: TransformsState | undefined, action: AllActions): TransformsState {
    if (!state) {
        return { joins: [] };
    }
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "ADD_JOIN": {
            return {...state, joins: state.joins.concat([action.payload])};
        }
        case "REMOVE_JOIN": {
            const joins = state.joins.filter(j => !(j.left === action.payload.left && j.right === action.payload.right));
            if (joins.length === state.joins.length) {
                throw new Error("Attempted to remove a join which does not exist in the state.");
            }
            return {...state, joins};
        }
        default: return state;
    }
}