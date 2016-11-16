export interface DataAdapter {
    updateCache(): Promise<void>;
    remove(): Promise<void>;
}

export * from "./memory";
export * from "./sql";