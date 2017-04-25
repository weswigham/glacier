import { ReduxStandardAction } from "./";
export declare type AddMarkAction = ReduxStandardAction<"ADD_MARK", {
    uuid: number;
}>;
export declare function createAddConfigurationAction(): AddMarkAction;
