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
        throw action.error;
    }
    switch (action.type) {
        case "ADD_DATA_SOURCE": {
            if (state[action.payload.id]) throw new Error(`Attempted to add data source with id ${action.payload.id} which already exists in the store.`);
            return {...state, [action.payload.id]: action.payload};
        }
        case "REMOVE_DATA_SOURCE": {
            if (!state[action.payload.id]) throw new Error(`Attempted to remove data source with id ${action.payload.id} which does not exist in the store.`);
            return filterState(state, action.payload.id);
        }
        case "UPDATE_DATA_CACHE": {
            const found = state[action.payload.id];
            if (!found) throw new Error(`Attempted to update the cached data for data source with id ${action.payload.id} which did not exist in the store.`);
            return {...state, [action.payload.id]: {...found as DataSource<any, any, any>, cache: action.payload.cache}};
        }
        default: return state;
    }
}