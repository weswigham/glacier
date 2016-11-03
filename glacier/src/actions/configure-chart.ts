import {ReduxStandardAction} from "./";

export type UpdateConfigurationAction<V> = ReduxStandardAction<"UPDATE_CONFIGURATION", {settingName: string, settingValue: V, uuid: number}>;

// export type UpdateMarkAction<V> = UpdateConfigurationAction<"update-mark", {uuid: number, mark: V}>;
// export type UpdateSizeAction = UpdateConfigurationAction<"UPDATE_SIZE", {uuid: number, width: number, height: number}>;
// export type UpdateDescriptionAction = UpdateConfigurationAction<"UPDATE_DESCRIPTION", {uuid: number, desc: string}>;
// export type UpdateEncodingAction = UpdateConfigurationAction<"UPDATE_ENCODING", {uuid: number, encoding: {}}>;

// export function createUpdateMarkAction(uuid: number, mark: string): UpdateMarkAction {
//     return {type: "UPDATE_MARK", payload: {uuid, mark}};
// }
// export function createUpdateSizeAction(uuid: number, width: number, height: number): UpdateSizeAction {
//     return {type: "UPDATE_SIZE", payload: {uuid, width, height}};
// }
// export function createUpdateDescriptionAction(uuid: number, desc: string): UpdateDescriptionAction {
//     return {type: "UPDATE_DESCRIPTION", payload: {uuid, desc}};
// }
// export function createUpdateEncodingAction(uuid: number, encoding: {}): UpdateEncodingAction {
//     return {type: "UPDATE_ENCODING", payload: {uuid, encoding}};
// }

export function createUpdateConfiguration<V>(uuid : number, settingName : string, settingValue: V): UpdateConfigurationAction<V> {
    return { type: "UPDATE_CONFIGURATION", payload: {settingName: settingName, settingValue: settingValue, uuid: uuid}};
}