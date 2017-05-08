export interface Exporter<T> {
    (): void;
    export(): Promise<T>;
    dispose(): void;
}
export * from "./svg";
export * from "./zip";
