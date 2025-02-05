/* eslint-disable @typescript-eslint/no-explicit-any */
type Path = string | number | (string | number)[];

/**
 * Sets the value at path of object.
 * If a portion of the path doesn't exist, it's created.
 * Arrays are created for missing index properties, while objects are created for all other missing properties.
 *
 * @param obj The object to modify.
 * @param path The path of the property to set.
 * @param value The value to set.
 */
function set(obj: any, path: Path, value: any): any {
    if (!obj) return obj;

    // Convert the path to an array
    const pathArray = Array.isArray(path)
        ? path
        : `${path}`
            .replace(/\[(\d+)]/g, '.$1') // Convert '[0]' to '.0'
            .split('.') // Split by dot
            .filter(Boolean); // Remove any empty strings caused by trailing dots

    let current = obj;

    for (let i = 0; i < pathArray.length - 1; i++) {
        const key = isNaN(Number(pathArray[i])) ? pathArray[i] : Number(pathArray[i]);

        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = isNaN(Number(pathArray[i + 1])) ? {} : [];
        }

        current = current[key];
    }

    const finalKey = isNaN(Number(pathArray[pathArray.length - 1]))
        ? pathArray[pathArray.length - 1]
        : Number(pathArray[pathArray.length - 1]);

    current[finalKey] = value;

    return obj;
}

export default set;