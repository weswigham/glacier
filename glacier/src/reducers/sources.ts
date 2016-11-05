import {AnyDataSource, SourcesModelState} from "../model";
import {AllActions} from "../actions";

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
            //return {...state, [action.payload.uuid]: action.payload};
            const newState = Object.create(state);
            (newState as any)[action.payload.uuid] = action.payload;
            return newState;
        }
        case "REMOVE_DATA_SOURCE": {
            // TODO: Consider issuing error if action.payload.uuid is not already present in the state?
            //return {...state, [action.payload.uuid]: undefined};
            const newState = Object.create(state);
            delete action.payload.uuid;
            return newState;
        }
        case "UPDATE_DATA_CACHE": {
            const found = state[action.payload.uuid];
            if (!found) return state; // TODO: Issue error if no cache is found to place update into?
            //return {...state, [action.payload.uuid]: {...found, cache: action.payload.cache}};
            const newState = Object.create(state);
            const newFound = Object.create(found);
            (newFound as any).cache = action.payload.cache;
            (newState as any)[action.payload.uuid] = newFound;
            return newState;
        }
        default: return state;
    }
}