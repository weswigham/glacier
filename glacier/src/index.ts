import * as redux from "redux";
import * as vl from "vega-lite";
declare global {
    interface Element {}
}
import * as vega from "vega";

export type ReduxStandardAction<T extends string, P> = {type: T, payload: P, error?: Error};
export type AddDataSource<S extends string, T, C> = ReduxStandardAction<"ADD_DATA_SOURCE", {type: S, metadata: T, cache: C}>;
export type AddSqliteFileDataSource<S> = AddDataSource<"sqlite-file", {path: string}, S>;


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

export {createDataSource as createSqlDataSource} from './sqlDataSource';

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
            vega.parse.spec(vl.compile(spec), chart => {
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