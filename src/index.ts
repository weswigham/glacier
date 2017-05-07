export * from "./model";
export * from "./actions";
export * from "./mapper";

import {createStore, combineReducers, Store} from "redux";
import * as allReducers from "./reducers";
import {ModelState} from "./model";
import {AllActions} from "./actions";


export const reducer: (state: ModelState, action: AllActions) => ModelState = combineReducers<ModelState>(allReducers as any as {[index: string]: () => any});
export function createModel(): Store<ModelState> {
    return createStore(reducer);
}

export * from "./adapters";
export * from "./exporters";