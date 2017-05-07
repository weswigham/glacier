export * from "./model";
export * from "./actions";
export * from "./mapper";
import { Store } from "redux";
import { ModelState } from "./model";
export declare function createModel(): Store<ModelState>;
export * from "./adapters";
export * from "./exporters";
