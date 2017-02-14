export interface DataAdapter {
    updateCache(): Promise<any>;
    remove(): Promise<any>;
    uuid: number;
}

export * from "./memory";
export * from "./sql";