import {ReduxStandardAction} from "./";
import {Encoding} from "../model/index";

export type UpdateMarkAction<V> = ReduxStandardAction<"UPDATE_MARK", {settingName: string, settingValue: V}>;
export type UpdateSizeAction = UpdateMarkAction<{width:number, height: number}>;
export type UpdateMarkeTypeAction = UpdateMarkAction<string>;
export type UpdateEncodingAction = UpdateMarkAction<Encoding>;
export type UpdateDescriptionAction = UpdateMarkAction<string>;

export function createMarkConfiguration<V>(settingName : string, settingValue: V): UpdateMarkAction<V> {
    return { type: "UPDATE_MARK", payload: {settingName: settingName, settingValue: settingValue}};
}

export function createUpdateMarkTypeAction(typeValue: string): UpdateMarkeTypeAction{
    return {type: "UPDATE_MARK", payload: {settingName: "markType", settingValue:typeValue}};
}

export function createUpdateSizeAction(height: number, width: number): UpdateSizeAction{
    return {type: "UPDATE_MARK", payload: {settingName: "size", settingValue:{width:width, height:height}}};
}

export function createUpdateEncodingAction(encoding: Encoding): UpdateEncodingAction{
    return {type: "UPDATE_MARK", payload: {settingName: "encoding", settingValue: encoding}};
}
export function createUpdateDescriptionAction(desc: string): UpdateDescriptionAction{
    return {type: "UPDATE_MARK", payload: {settingName: "desc", settingValue: desc}}
}