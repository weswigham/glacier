export interface DataAdapter {
    updateCache(): void;
    remove(): void;
}

export * from "./memory";
export * from "./sql";