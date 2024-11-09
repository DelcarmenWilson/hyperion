export function getEnumValues<T extends Record<string, string>>(enumObject: T): Array<{ value: string, name: string }> {
    return Object.keys(enumObject)
      .map(key => ({ value:key, name: enumObject[key] }));
  }