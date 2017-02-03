import {FieldState, Field} from "../model";
import {AllActions} from "../actions";

export function fields(state: FieldState | undefined, action: AllActions) {
     if (!state) return {};
     if (action.error) {
         throw action.error;
     }
     switch (action.type) {
         case "ADD_FIELD": {
            return {...state, ...action.payload};
         }
         case "REMOVE_FIELD": {
             let filteredState: Field[] = [];
             for (const field of action.payload) {
                 filteredState = state.fields.filter(item =>
                     field.name !== item.name && field.table !== item.table);
             }
             return {filteredState};
         }
         default: return state;
     }
}