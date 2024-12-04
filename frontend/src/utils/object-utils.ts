/**
 * This function with assign given value to an object based on the object path provided
 *
 * @param obj The object to be built
 * @param path The fields path of the object. For example { a: {b: "value1"}} --> path a.b
 * @param value
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function setNestedField(
  obj: Record<string, any>,
  path: string,
  value: any,
): void {
  const keys = path.split(".");
  let current = obj;
  keys.forEach((key, index) => {
    if (!current[key]) {
      current[key] = {};
    }
    if (index === keys.length - 1) {
      current[key] = value;
    }
    current = current[key];
  });
}

// Compare object A and B. If any field of object A is the same value as that field of object B then remove that field in object A.
export function removeMatchingFields(
  toCompareObject: any,
  originalObject: any,
): any {
  for (const key in toCompareObject) {
    if (
      Object.prototype.hasOwnProperty.call(toCompareObject, key) &&
      Object.prototype.hasOwnProperty.call(originalObject, key)
    ) {
      if (
        Array.isArray(toCompareObject[key]) &&
        Array.isArray(originalObject[key])
      ) {
        if (
          toCompareObject[key].length === originalObject[key].length &&
          toCompareObject[key].every((item: any) =>
            originalObject[key].includes(item),
          )
        ) {
          delete toCompareObject[key];
        } else if (
          JSON.stringify(toCompareObject[key]) ===
          JSON.stringify(originalObject[key])
        ) {
          delete toCompareObject[key];
        }
      } else if (toCompareObject[key] === originalObject[key]) {
        delete toCompareObject[key];
      }
    }
  }
  return toCompareObject;
}
