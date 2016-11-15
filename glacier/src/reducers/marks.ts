import {MarkState, AnyDataSource} from "../model";
import {AllActions} from "../actions";

export function marks(state: MarkState | undefined, action: AllActions): MarkState {
    if (!state) return {}
    if (action.error) {
        // TODO: Logging? Graceful recovery? Error handler provided by consumer?
        throw action.error;
        // return state;
    }
    switch(action.type) {
        case "UPDATE_MARK": {
            const newState = Object.create(state);
            switch(action.payload.settingName){
                case "desc": {
                    return {...state, description:action.payload.settingValue};
                }
                case "encoding":{

                    return newState;
                }
                case "size": {

                    return newState;
                }
                case "markType": {

                    return newState;
                }
                default: return state;
            }
        }
        default: return state;
    }
}