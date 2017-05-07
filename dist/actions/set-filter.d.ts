import { ReduxStandardAction } from "./";
import { FilterDescriptor, FilterDescriptorArg } from "../model";
export declare type SetFilterAction = ReduxStandardAction<"SET_FILTER", FilterDescriptor | undefined>;
export declare function createSetFilterAction(filter: FilterDescriptorArg | undefined): SetFilterAction;
