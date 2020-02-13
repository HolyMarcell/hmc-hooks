import {config} from "../config";
import {equals, path, pathOr, prop} from "../util/ram";
import {createSelector, createSelectorCreator, defaultMemoize} from "reselect";
import {PaginationMapper, RequestDataSelection} from "./types";
import createCachedSelector from 're-reselect';


const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
);

const storeIdAsCacheKey = (_, id) => id;


export const selectHttp = state => prop(config.httpKey, state);
export const secondArg = (_, v) => v;

export const selectRequest = createCachedSelector(
  selectHttp,
  secondArg,
  (state, id) => prop(id, state)
)(storeIdAsCacheKey);


export const selectNotAction = createCachedSelector(
  selectRequest,
  secondArg,
  ({action, ...notAction}) => notAction
)(storeIdAsCacheKey);


const mapPagination = (
  data: Record<string, any>,
  paginationMapper: PaginationMapper) => {
  const {fromData: mapper} = paginationMapper;
  const {nestedSplitChar: split, ...pm} = mapper;

  return {
    data: pathOr([], pm.elements.split(split), data),
    pagination: {
      totalElements: path(pm.totalElements.split(split), data),
      totalPages: path(pm.totalPages.split(split), data),
      size: path(pm.size.split(split), data),
      page: path(pm.page.split(split), data),
      numberOfElements: path(pm.numberOfElements.split(split), data),
    },
  };
};

export const selectData = createCachedSelector(
  selectNotAction,
  secondArg,
  (state) => {
    const {
      data,
      hasError,
      error,
      loading,
      hasData,
      paginated,
      sort,
      filter,
      paginationMapper
    } = state;

    if (!paginated) {
      return {
        data: hasData ? data : {},
        hasData,
        loading,
        error,
        hasError,
      } as RequestDataSelection;
    } else {
      return {
        ...mapPagination(hasData ? data : {}, paginationMapper),
        loading,
        hasData,
        error,
        hasError,
        sort,
        filter,
      } as RequestDataSelection;
    }
  }
)(storeIdAsCacheKey);

export const selectAction = createCachedSelector(
  selectHttp,
  secondArg,
  (state, id) => pathOr({}, [id, 'action'], state)
)(storeIdAsCacheKey);

export const selectPaginationMapper = createCachedSelector(
  selectNotAction,
  secondArg,
  (state, id) => pathOr({}, ['paginationMapper'], state)
)(storeIdAsCacheKey);

export const selectSortMapper = createCachedSelector(
  selectNotAction,
  secondArg,
  (state, id) => pathOr({}, ['sortMapper'], state)
)(storeIdAsCacheKey);

export const selectFilter = createCachedSelector(
  selectNotAction,
  secondArg,
  (state, id) => pathOr({}, ['filter'], state)
)(storeIdAsCacheKey);

export const selectIsPaginated = createCachedSelector(
  selectNotAction,
  secondArg,
  (state, id) => pathOr(false, ['paginated'], state)
)(storeIdAsCacheKey);
