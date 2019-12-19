import {config} from "../config";
import {equals, path, pathOr, prop, propOr} from "../util/ram";
import {createSelector, createSelectorCreator, defaultMemoize} from "reselect";
import {PaginationMapper} from "./types";

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

export const selectPageParam = createSelector(
  selectHttp,
  selectConst,
  (state, id) => pathOr(0, [id, 'action', 'page'], state)
);



const mapPagination = (
  data: Record<string, any>,
  paginationMapper: PaginationMapper) => {
  const {nestedSplitChar: split, ...pm} = paginationMapper;

  return {
    data: pathOr([], pm.elements.split(split), data),
    pagination: {
      totalElements: path(pm.totalElements.split(split), data),
      totalPages: path(pm.totalPages.split(split), data),
      index: path(pm.index.split(split), data),
      size: path(pm.size.split(split), data),
      numberOfElements: path(pm.numberOfElements.split(split), data),
    },
  };
};

export const selectData = createDeepEqualSelector(
  selectHttp,
  selectConst,
  (state, id) => {
    const {
      data,
      hasError,
      error,
      loading,
      hasData,
      paginated,
      paginationMapper
    } = propOr({}, id, state);

    if (!paginated) {
      return {
        data: hasData ? data : {},
        loading,
        error,
        hasError,
      };
    } else {
      return {
        ...mapPagination(hasData ? data : {}, paginationMapper),
        loading,
        error,
        hasError,
      };
    }
  }
);

export const selectAction = createSelector(
  selectHttp,
  selectConst,
  (state, id) => pathOr({}, [id, 'action'], state)
);

export const selectPaginationMapper = createSelector(
  selectHttp,
  selectConst,
  (state, id) => pathOr({}, [id, 'action'], state)
);
