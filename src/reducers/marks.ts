import {MarkState} from "../model";
import {AllActions} from "../actions";

export function marks(state: MarkState | undefined, action: AllActions): MarkState {
    if (!state) return {};
    if (action.error) {
        throw action.error;
    }
    switch (action.type) {
        case "UPDATE_MARK": {
            switch (action.payload.settingName) {
                case "desc": {
                    return {...state, description: action.payload.settingValue};
                }
                case "size": {
                    return {...state, width: action.payload.settingValue.width, height: action.payload.settingValue.height};
                }
                case "markType": {
                    return {...state, mark: action.payload.settingValue};
                }
                default: return state;
            }
        }
        default: return state;
    }
}