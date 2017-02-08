import { FieldState } from "../model";
import { AllActions } from "../actions";

export function fields(state: FieldState | undefined, action: AllActions): FieldState {
    if (!state) {
        return [];
    }
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "ADD_FIELDS": {
            return [...state, ...action.payload.fields];
        }
        case "REMOVE_FIELDS": {
            let validFields = action.payload.fields.filter(
                item => satisfies(state,
                    field => item.name === field.name && item.table === field.table && item.dataSource === field.dataSource
                )
            );
            if (validFields.length !== action.payload.fields.length) throw new Error("Field not in state.");
            for (const field of validFields) {
                validFields = state.filter(item =>
                    field.name !== item.name && field.table !== item.table && field.dataSource !== item.dataSource);
            }
            return validFields;
        }
        default: return state;
    }
}

function satisfies<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
    for (const item of arr) {
        if (predicate(item)) return item;
    }
    return undefined;
}