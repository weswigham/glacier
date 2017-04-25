import { ReduxStandardAction } from "./";
import { Channel, ChannelArguments } from "../model";
export declare type AddChannelAction<T extends Channel> = ReduxStandardAction<"ADD_CHANNEL", {
    kind: T;
    value: ChannelArguments<T>;
}>;
export declare type RemoveChannelAction<T extends Channel> = ReduxStandardAction<"REMOVE_CHANNEL", {
    kind: T;
}>;
export declare type UpdateChannelAction<T extends Channel> = ReduxStandardAction<"UPDATE_CHANNEL", {
    kind: T;
    value: ChannelArguments<T>;
}>;
export declare function createAddChannelAction<T extends Channel>(kind: T, value: ChannelArguments<T>): AddChannelAction<T>;
export declare function createRemoveChannelAction<T extends Channel>(kind: T): RemoveChannelAction<T>;
export declare function createUpdateChannelAction<T extends Channel>(kind: T, value: ChannelArguments<T>): UpdateChannelAction<T>;
