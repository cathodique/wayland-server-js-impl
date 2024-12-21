export function snakeToCamel(str) {
    return str.replace(/_[a-z]?/g, (v) => v.slice(1).toUpperCase());
}
