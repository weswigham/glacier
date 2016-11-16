export interface DataAdapter {
    updateCache(): Promise<void>;
    remove(): void;
}

export * from "./memory";
export * from "./sql";