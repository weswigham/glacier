import {MarkState, AnyDataSource} from "../model";
import {AllActions} from "../actions";

function clone(o: any):{}{
    let ret: any = {};
    Object.keys(o).forEach(function(val: any){
        ret[val] = o[val];
    })
    return ret;
}

export function marks(state: MarkState | undefined, action: AllActions): MarkState {
    if (!state) return {}
    if (action.error) {
        // TODO: Logging? Graceful recovery? Error handler provided by consumer?
        throw action.error;
        // return state;
    }
    switch(action.type) {
        case "UPDATE_MARK": {
            let newState = Object.create(state);
            newState = clone(state);
            switch(action.payload.settingName){
                case "desc": {
                    (newState as any).description = action.payload.settingValue
                    return newState;
                }
                case "encoding":{
                    (newState as any).encoding = action.payload.settingValue
                    return newState;
                }
                case "size": {
                    (newState as any).width = (action.payload.settingValue as any).width;
                    (newState as any).height = (action.payload.settingValue as any).height;
                    return newState;
                }
                case "markType": {
                    (newState as any).mark = action.payload.settingValue
                    return newState;
                }
                default: return state;
            }
        }
        default: return state;
    }
}