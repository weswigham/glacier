import {ChannelState} from "../model";
import {AllActions} from "../actions";

export function channels(state: ChannelState | undefined, action: AllActions): ChannelState {
    if (!state) {
        return {};
    }
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "ADD_CHANNEL": {
            if (state[action.payload.kind]) throw new Error(`Channel ${action.payload.kind} already set!`);
            return {...state, [action.payload.kind]: action.payload.value};
        }
        case "REMOVE_CHANNEL": {
            if (!state[action.payload.kind]) throw new Error(`Channel ${action.payload.kind} does not exist!`);
            const newState = {...state};
            delete newState[action.payload.kind];
            return newState;
        }
        case "UPDATE_CHANNEL": {
            if (!state[action.payload.kind]) throw new Error(`Channel ${action.payload.kind} does not exist!`);
            return {...state, [action.payload.kind]: action.payload.value};
        }
        default: return state;
    }
}