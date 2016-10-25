export * from "./model";

import {createStore, combineReducers} from "redux";
import * as actions from "./actions";
import * as reducers from "./reducers";
import {ModelState} from "./model";

export function createModel() {
    return createStore(combineReducers<ModelState>(reducers as any as {[index: string]: () => any}));
}

export * from "./adapters";
export * from "./exporters";