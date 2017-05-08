import { ReduxStandardAction } from "./";
export declare type UpdateMarkAction<K extends string, V> = ReduxStandardAction<"UPDATE_MARK", {
    settingName: K;
    settingValue: V;
}>;
export declare type UpdateSizeAction = UpdateMarkAction<"size", {
    width: number;
    height: number;
}>;
export declare type UpdateMarkTypeAction = UpdateMarkAction<"markType", string>;
export declare type UpdateDescriptionAction = UpdateMarkAction<"desc", string>;
export declare function createMarkConfiguration<K extends string, V>(settingName: K, settingValue: V): UpdateMarkAction<K, V>;
export declare function createUpdateMarkTypeAction(typeValue: string): UpdateMarkTypeAction;
export declare function createUpdateSizeAction(height: number, width: number): UpdateSizeAction;
export declare function createUpdateDescriptionAction(desc: string): UpdateDescriptionAction;
