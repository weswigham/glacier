export interface Exporter<T> {
    (): void; // OnUpdate method
    export(): Promise<T>;
}

export * from "./svg";
export * from "./zip";