export function snakeToCamel(str: string) {
  return str.replace(/_[a-z]?/g, (v) => v.slice(1).toUpperCase());
}

export function snakePrepend(str1: string, str2: string) {
  return `${str1}${str2[0].toUpperCase()}${str2.slice(1)}`;
}
