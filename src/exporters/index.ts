export interface Exporter<T> {
    (): void; // OnUpdate method
    export(): Promise<T>;
    dispose(): void;
}

export * from "./svg";
export * from "./zip";