import {config} from "../config";
import {equals, path, pathOr, prop} from "../util/ram";
import {createSelector, createSelectorCreator, defaultMemoize} from "reselect";
import {PaginationMapper, RequestDataSelection} from "./types";

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
);


export const selectHttp = state => prop(config.reduxTopLevelKey, state);
export const selectConst = (_, v) => v;

export const selectRequest = createSelector(
  selectHttp,
  selectConst,
  (state, id) => prop(id, state)
);


export const selectNotAction = createSelector(
  selectRequest,
  selectConst,
  ({action, ...notAction}) => notAction
);


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

export const selectData = createDeepEqualSelector(
  selectNotAction,
  selectConst,
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
);

export const selectAction = createSelector(
  selectHttp,
  selectConst,
  (state, id) => pathOr({}, [id, 'action'], state)
);

export const selectPaginationMapper = createSelector(
  selectNotAction,
  selectConst,
  (state, id) => pathOr({}, ['paginationMapper'], state)
);

export const selectSortMapper = createSelector(
  selectNotAction,
  selectConst,
  (state, id) => pathOr({}, ['sortMapper'], state)
);

export const selectFilter = createSelector(
  selectNotAction,
  selectConst,
  (state, id) => pathOr({}, ['filter'], state)
);

export const selectIsPaginated = createSelector(
  selectNotAction,
  selectConst,
  (state, id) => pathOr(false, ['paginated'], state)
);
