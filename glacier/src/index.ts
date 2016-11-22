export * from "./model";
export * from "./actions";

import {createStore, combineReducers, Store} from "redux";
import * as actions from "./actions";
import * as reducers from "./reducers";
import {ModelState} from "./model";

export function createModel(): Store<ModelState> {
    return createStore(combineReducers<ModelState>(reducers as any as {[index: string]: () => any}));
}

export * from "./adapters";
export * from "./exporters";