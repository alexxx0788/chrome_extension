export function isObjectUndefined(obj) {
    return obj === undefined;
}

export function isObjectUndefinedOrEmpty(obj) {
    return obj === undefined || obj === '';
}

export default {
    isObjectUndefined,
    isObjectUndefinedOrEmpty
}