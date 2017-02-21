export interface DataAdapter {
    updateCache(): Promise<any>;
    remove(): Promise<any>;
    id: number;
}

export * from "./memory";
export * from "./sql";