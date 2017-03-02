export function satisfies<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
    for (const item of arr) {
        if (predicate(item)) return item;
    }
    return undefined;
}