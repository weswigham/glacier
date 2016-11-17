import {AnyDataSource, SourcesModelState, DataSource} from "../model";
import {AllActions} from "../actions";

function filterState(state: SourcesModelState, toRemove: number) {
    const ret: SourcesModelState = {};
    Object.keys(state).filter(k => k !== toRemove.toString()).forEach(key => {
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
    // TODO: Update TS dependency to typescript@next once TS#11150 is merged
    // and use commented object spead expressions in the below rather than
    // the inelegant casts
    switch(action.type) {
        case "ADD_DATA_SOURCE": {
            // TODO: Consider issuing error if action.payload.uuid is already present in the state?
            if (state[action.payload.uuid]) return state;
            return {...state, [action.payload.uuid]: action.payload};
        }
        case "REMOVE_DATA_SOURCE": {
            // TODO: Consider issuing error if action.payload.uuid is not already present in the state?
            return {...filterState(state, action.payload.uuid)};
        }
        case "UPDATE_DATA_CACHE": {
            const found = state[action.payload.uuid];
            if (!found) return state; // TODO: Issue error if no cache is found to place update into?
            return {...state, [action.payload.uuid]: {...found as DataSource<any, any, any>, cache: action.payload.cache}};
        }
        default: return state;
    }
}