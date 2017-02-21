import {SourcesModelState, DataSource, AnyDataSource} from "../model";
import {AllActions} from "../actions";

function filterState(state: SourcesModelState, toRemove: number): SourcesModelState {
    const ret: {[index: number]: AnyDataSource} = {};
    Object.keys(state).map(k => +k).filter(k => k !== toRemove).forEach(key => {
        ret[key] = state[key];
    });
    return ret;
}

export function sources(state: SourcesModelState | undefined, action: AllActions): SourcesModelState {
    if (!state) return {};
    if (action.error) {
        // TODO: Logging? Graceful recovery? Error handler provided by consumer?
        throw action.error;
        // return state;
    }
    switch (action.type) {
        case "ADD_DATA_SOURCE": {
            // TODO: Consider issuing error if action.payload.uuid is already present in the state?
            if (state[action.payload.id]) return state;
            return {...state, [action.payload.id]: action.payload};
        }
        case "REMOVE_DATA_SOURCE": {
            // TODO: Consider issuing error if action.payload.uuid is not already present in the state?
            return filterState(state, action.payload.id);
        }
        case "UPDATE_DATA_CACHE": {
            const found = state[action.payload.id];
            if (!found) return state; // TODO: Issue error if no cache is found to place update into?
            return {...state, [action.payload.id]: {...found as DataSource<any, any, any>, cache: action.payload.cache}};
        }
        default: return state;
    }
}