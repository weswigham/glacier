import * as redux from "redux";

export interface ModelState {}
export type Message = {}
export type SourceType = "sqlite";

export function createModel() {
    return redux.createStore((state: ModelState, action: Message) => {
        // TODO: Define actions and handle state changes
        return state;
    });
}

export function createSqliteDataSource() {
    return createDataSource("sqlite");
}

export function createDataSource(type: SourceType) {
    return new class {

    };
}

export interface Exporter {
    (): void; // OnUpdate method
    export(): string;
}


export function createExporter(store: redux.Store<ModelState>) {
    const updater: Exporter = ((() => {
        // On update...
        store.getState()
    }) as Exporter)
    updater.export = () => {
        return "";
    }
    return updater;
}