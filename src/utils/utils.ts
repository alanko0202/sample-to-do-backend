import { isArray, isString } from "lodash/fp";
import _ from "lodash";
import { InvalidOrderError, InvalidSortError } from "./errors";

type SortOrder = "asc" | "desc";

export interface SortMap {
  [key: string]: SortOrder | SortMap;
}

export interface SortParamsObject {
  [key: string]: SortOrder | SortParamsObject;
}
type SortParams = string | string[] | SortParamsObject | SortParamsObject[];

type OrderByQuery = SortMap | SortMap[];

const isStringArray = (value: unknown): value is string[] =>
  isArray(value) && value.every(isString);
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  _.isPlainObject(value);

const convertSortQueryParams = (sortQuery: SortParams) => {
  if (isStringArray(sortQuery)) {
    let sortColumnList = sortQuery.flatMap((sortValue: string) =>
      convertStringSortQueryParam(sortValue)
    );

    const sortColumns = convertSortParamsToQuery(sortColumnList);

    return sortColumns;
  }

  throw new InvalidSortError();
};

const convertStringSortQueryParam = (sortQuery: string): SortMap[] => {
  return sortQuery
    .split(",")
    .map((value) => convertSingleSortQueryParam(value));
};

const convertSingleSortQueryParam = (sortQuery: string): SortMap => {
  if (!sortQuery) {
    return {};
  }

  if (!isString(sortQuery)) {
    throw new Error("Invalid sort query");
  }

  const [field, order = "asc"] = sortQuery.split(":");

  if (field.length === 0) {
    throw new Error("Field cannot be empty");
  }

  validateOrder(order);

  return _.set({}, field, order);
};

const convertSortParamsToQuery = (sortParams: any) => {
  let sortColumns = sortParams
    .map((obj: SortParamsObject) => {
      const keyValues = Object.entries(obj).map(
        ([key, value]) => `${key} ${value}`
      );
      return keyValues.join(", ");
    })
    .join(", ");

  return sortColumns;
};

function validateOrder(order: string): asserts order is SortOrder {
  if (
    !isString(order) ||
    !["asc", "desc"].includes(order.toLocaleLowerCase())
  ) {
    throw new InvalidOrderError();
  }
}
export { convertSortQueryParams };
