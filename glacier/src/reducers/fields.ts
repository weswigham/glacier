import {FieldState, Field} from "../model";
import {AllActions} from "../actions";

export function fields(state: FieldState | undefined, action: AllActions): FieldState {
     if (!state) {
         let fields: Field[] = [];
         return {fields: fields, dataSource: ""};
     }
     if (action.error) {
         throw action.error;
     }
     switch (action.type) {
         case "ADD_FIELDS": {
            return {fields: [...state.fields, ...action.payload.fields], dataSource: action.payload.dataSource};
         }
         case "REMOVE_FIELDS": {
             let filteredState: Field[] = [];
             for (const field of action.payload.fields) {
                 filteredState = state.fields.filter(item =>
                     field.name !== item.name && field.table !== item.table);
             }
             return {fields: filteredState, dataSource: action.payload.dataSource};
         }
         default: return state;
     }
}