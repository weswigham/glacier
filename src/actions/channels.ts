import {ReduxStandardAction} from "./";
import {Channel, ChannelArguments} from "../model";

export type AddChannelAction<T extends Channel> = ReduxStandardAction<"ADD_CHANNEL", {kind: T, value: ChannelArguments<T>}>
export type RemoveChannelAction<T extends Channel> = ReduxStandardAction<"REMOVE_CHANNEL", {kind: T}>
export type UpdateChannelAction<T extends Channel> = ReduxStandardAction<"UPDATE_CHANNEL", {kind: T, value: ChannelArguments<T>}>

export function createAddChannelAction<T extends Channel>(kind: T, value: ChannelArguments<T>): AddChannelAction<T> {
    return {type: "ADD_CHANNEL", payload: {kind, value}};
}

export function createRemoveChannelAction<T extends Channel>(kind: T): RemoveChannelAction<T> {
    return {type: "REMOVE_CHANNEL", payload: {kind}};
}

export function createUpdateChannelAction<T extends Channel>(kind: T, value: ChannelArguments<T>): UpdateChannelAction<T> {
    return {type: "UPDATE_CHANNEL", payload: {kind, value}};
}

