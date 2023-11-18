import { get, isEmpty } from "lodash";

export const getOr = (obj, path, fallback) => {
  const value = get(obj, path);
  return isEmpty(value) ? fallback : value;
};
export const removeEmptyItems = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') removeEmptyItems(obj[key]);
  });
  return obj;
};
