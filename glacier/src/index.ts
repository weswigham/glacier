import * as redux from "redux";
import {compile} from "vega-lite";
import * as vega from "vega";

export interface ModelState {
    spec: any
}
export interface NewSpecMessage {
    type: 'new-spec';
    spec: any;
}
export type Message = NewSpecMessage;
export type SourceType = "sqlite";

export function createModel() {
    return redux.createStore((state: ModelState, action: Message) => {
        switch (action.type) {
            case 'new-spec': return {spec: action.spec}; // TODO: Break down into smaller, composable, actions (to support multiple sources), strongly type vega lite spec
            default: return state;
        }
    });
}

export function createMemoryDataSource(store: redux.Store<ModelState>) {
    return (spec: any) => {
        store.dispatch({type: 'new-spec', spec});
    }
}

export interface Exporter<T> {
    (): void; // OnUpdate method
    export(): Promise<T>;
}


export function createSvgExporter(store: redux.Store<ModelState>) {
    const updater: Exporter<string> = ((() => {
        // On update...
        // store.getState()
    }) as Exporter<string>)
    updater.export = () => {
        const {spec} = store.getState();
        return new Promise<string>((resolve, reject) => {
            vega.parse.spec(compile(spec), chart => {
                let result: string | undefined;
                try {
                    result = chart({renderer: 'svg'}).update().svg();
                }
                catch (e) {
                    return reject(e);
                }
                resolve(result);
            });
        });
    };
    store.subscribe(updater);
    return updater;
}