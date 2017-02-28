import { FieldState } from "../model";
import { AllActions } from "../actions";
import { satisfies } from "../util";

export function fields(state: FieldState | undefined, action: AllActions): FieldState {
    if (!state) {
        return {};
    }
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "ADD_FIELDS": {
            return action.payload.fields.reduce((prev, f) => {
                if (prev[f.id]) {
                    throw new Error("Attempted to add field which already existed in the state!");
                }
                prev[f.id] = f;
                return prev;
            }, state);
        }
        case "REMOVE_FIELDS": {

            let validFields = action.payload.fields.filter(
                item => satisfies(Object.keys(state).map(k => state[+k]),
                    field => item.name === field.name && item.table === field.table && item.dataSource === field.dataSource
                )
            );

            if (validFields.length !== action.payload.fields.length) throw new Error("Field not in state.");
            return Object.keys(state).map(k => state[+k]).filter(
                item => !satisfies(validFields,
                    field => item.name === field.name && item.table === field.table && item.dataSource === field.dataSource
                )
            ).reduce((prev, f) => {
                prev[f.id] = f;
                return prev;
            }, {} as FieldState);
        }
        case "REMOVE_FIELDS_BY_ID": {
            return action.payload.fields.reduce((prev, id) => {
                if (!prev[id]) {
                    throw new Error("Attempted to remove field which did not exist in the state!");
                }
                delete prev[id];
                return prev;
            }, state);
        }
        default: return state;
    }
}
