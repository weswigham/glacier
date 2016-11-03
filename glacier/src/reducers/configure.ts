/**import {SourcesModelState, Spec, AnyDataSource} from "../model";
import {AllActions} from "../actions";

export function sources(state: SourcesModelState | undefined, action: AllActions): SourcesModelState {
    if (!state) return {spec:{}};
    if (action.error) {
        // TODO: Logging? Graceful recovery? Error handler provided by consumer?
        throw action.error;
        // return state;
    }
    switch(action.type) {
        case "ADD_CONFIGURATION": {
            const newState = {state[action.payload.uuid]:AnyDataSource, {}: Spec}
            return newState;
        }
        case "UPDATE_CONFIGURATION": {
            const found = state[action.payload.uuid];
            if (!found) return state; // TODO: Issue error if no cache is found to place update into?
            const newState = Object.create(state);
            return newState;
        }
        default: return state;
    }
}*/