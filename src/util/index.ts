export function satisfies<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
    for (const item of arr) {
        if (predicate(item)) return item;
    }
    return undefined;
}

export function Enum<X extends string>(...x: X[]): {[K in X]: K } {
    const o: any = {};
    for (const k in x) {
        o[x[k]] = x[k];
    }
    return o;
}

export function poisonPill(reason: string) {
    return function() {
        throw new Error(`Function has been poisoned. Reason: ${reason}`);
    }
}