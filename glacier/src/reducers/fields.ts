import {FieldState, Field} from "../model";
import {AllActions} from "../actions";

export function fields(state: FieldState | undefined, action: AllActions): FieldState {
     if (!state) {
         console.log("new state");
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
             console.log(state);
             let validFields = action.payload.fields.filter(item => {
                 return find(state, (field: Field) => {
                    return item.name === field.name && item.table === field.table && item.dataSource === field.dataSource;
                });
             });
             if (validFields.length !== action.payload.fields.length) throw "Field not in state.";
             for (const field of validFields) {
                 validFields = state.filter(item =>
                     field.name !== item.name && field.table !== item.table && field.dataSource !== item.dataSource);
             }
             return validFields;
         }
         default: return state;
     }
}

export function find<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
     // 1. Let O be ? ToObject(this value).
    //   if (array == undefined) {
    //     console.log(array);
    //     throw new TypeError("\"this\" is null or not defined");
    //   }

      const o = Object(arr);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      const len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== "function") {
        throw new TypeError("predicate must be a function");
      }

      // 5. Let k be 0.
      let k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        const kValue = o[k];
        if (predicate(kValue)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
}