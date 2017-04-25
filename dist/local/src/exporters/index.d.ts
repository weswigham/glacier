export interface Exporter<T> {
    (): void;
    export(): Promise<T>;
}
export * from "./svg";
export * from "./zip";
