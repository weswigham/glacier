import {ReduxStandardAction} from "./";
import {Encoding} from "../model/index";

export type UpdateMarkAction<K extends string, V> = ReduxStandardAction<"UPDATE_MARK", {settingName: K, settingValue: V}>;
export type UpdateSizeAction = UpdateMarkAction<"size", {width:number, height: number}>;
export type UpdateMarkTypeAction = UpdateMarkAction<"markType", string>;
export type UpdateEncodingAction = UpdateMarkAction<"encoding", Encoding>;
export type UpdateDescriptionAction = UpdateMarkAction<"desc", string>;

export function createMarkConfiguration<K extends string, V>(settingName: K, settingValue: V): UpdateMarkAction<K, V> {
    return { type: "UPDATE_MARK", payload: {settingName: settingName, settingValue: settingValue}};
}

export function createUpdateMarkTypeAction(typeValue: string): UpdateMarkTypeAction {
    return {type: "UPDATE_MARK", payload: {settingName: "markType", settingValue:typeValue}};
}

export function createUpdateSizeAction(height: number, width: number): UpdateSizeAction {
    return {type: "UPDATE_MARK", payload: {settingName: "size", settingValue:{width:width, height:height}}};
}

export function createUpdateEncodingAction(encoding: Encoding): UpdateEncodingAction {
    return {type: "UPDATE_MARK", payload: {settingName: "encoding", settingValue: encoding}};
}
export function createUpdateDescriptionAction(desc: string): UpdateDescriptionAction{
    return {type: "UPDATE_MARK", payload: {settingName: "desc", settingValue: desc}}
}