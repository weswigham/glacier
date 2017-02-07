import {FieldState, Field} from "../model";
import {AllActions} from "../actions";

export function fields(state: FieldState | undefined, action: AllActions): FieldState {
     if (!state) { return []; }
     if (action.error) {
         throw action.error;
     }
     switch (action.type) {
         case "ADD_FIELDS": {
            return [...state, ...action.payload.fields];
         }
         case "REMOVE_FIELDS": {
             let filteredState: Field[] = [];
             for (const field of action.payload.fields) {
                 filteredState = state.filter(item =>
                     field.name !== item.name && field.table !== item.table);
             }
             return filteredState;
         }
         default: return state;
     }
}