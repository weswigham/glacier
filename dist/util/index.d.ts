export declare function satisfies<T>(arr: T[], predicate: (item: T) => boolean): T | undefined;
export declare function Enum<X extends string>(...x: X[]): {
    [K in X]: K;
};
export declare function poisonPill(reason: string): () => never;
