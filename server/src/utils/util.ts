export const isEmpty = (value: string | number | object): boolean => {
    if (value === null) {
        return true;
    } else if (typeof value !== "number" && value === "") {
        return true;
    } else if (typeof value === "undefined" || value === undefined) {
        return true;
    } else if (
        value !== null &&
        typeof value === "object" &&
        !Object.keys(value).length
    ) {
        return true;
    } else {
        return false;
    }
};

export function exclude<T, Key extends keyof T>(
    obj: T,
    keys: Key[],
): Omit<T, Key> {
    for (let key of keys) {
        delete obj[key];
    }
    return obj;
}
