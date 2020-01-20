import {
  ChangeRequestAction,
  PaginationMapper,
  RegisterRequestAction, ResetFilterAction,
  SendRequestAction,
  SetFilterAction, SetPageAction,
  SetSortAction, SortMapper
} from "./types";
import {assoc, assocPath, isNil, path, pathOr, prop, propOr, reject, keys} from "../util/ram";
import parseUrlSegments from "../util/parseUrlSegments";
import {
  selectAction, selectFilter,
  selectPageParam,
  selectPaginationMapper,
  selectRequest,
  selectSortMapper
} from "./useDataSelectors";
import defaultPaginationMapper from "../util/defaultPaginationMapper";
import defaultSortMapper from "../util/defaultSortMapper";
import sortMapToParams from "../util/sortMapToParams";

export const REGISTER_REQUEST = 'http/useRequest/registerRequest';
export const CHANGE_REQUEST = 'http/useRequest/changeRequest';
export const SET_FILTER = 'http/useRequest/setFilter';
export const RESET_FILTER = 'http/useRequest/resetFilter';
export const SET_SORT = 'http/useRequest/setSort';
export const SEND_REQUEST = 'http/useRequest/sendRequest';
export const SEND_REQUEST_FAIL = 'http/useRequest/sendRequest_FAIL';
export const SEND_REQUEST_SUCCESS = 'http/useRequest/sendRequest_SUCCESS';

export const registerRequest = ({action, paginated, paginationMapper, sortMapper, id}: RegisterRequestAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const req = selectRequest(state, id);
    if (isNil(req)) {
      return dispatch(
        {
          type: REGISTER_REQUEST,
          payload: {action, paginated, paginationMapper, sortMapper, id}
        }
      )
    }
  }
};

export const changeRequest = ({id, type, value}: ChangeRequestAction) => {
  return {
    type: CHANGE_REQUEST,
    payload: {id, type, value}
  }
};

export const setFilter = ({id, filter}: SetFilterAction) => {
  return (dispatch) => {
    const {field, value} = filter;
    dispatch(changeRequest({id, type: 'params', value: {[field]: value}}));
    return dispatch({
      type: SET_FILTER,
      payload: {id, filter}
    });
  }
};

export const resetFilter = ({id}: ResetFilterAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const filter = selectFilter(state, id);
    // Unset all Params from the current filters
    keys(filter).map((fil) => {
      dispatch(changeRequest({id, type: 'params', value: {[fil]: null}}));
    });
    return dispatch({
      type: RESET_FILTER,
      payload: {id}
    });
  }
};

export const setSort = ({id, sort}: SetSortAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const sortMapper: SortMapper = selectSortMapper(state, id);

    const params = sortMapToParams(sortMapper, sort);

    dispatch(changeRequest({id, type: 'params', value: params}));
    return dispatch({
      type: SET_SORT,
      payload: {id, sort}
    });
  }
};

export const setPage = ({id, mod}: SetPageAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const {toParam: mapper}: PaginationMapper = selectPaginationMapper(state, id);
    const pageProp = prop('page', mapper);
    const page = selectPageParam(state, id);
    return dispatch(changeRequest({id, type: 'params', value: {[pageProp]: mod(page)}}));
  }
};


export const sendRequest = ({id}: SendRequestAction) => {
  return (dispatch, getState) => {

    const state = getState();
    const {segments, url, ...action} = selectAction(state, id);
    const resolvedUrl = parseUrlSegments(url, segments);

    return dispatch({
      type: SEND_REQUEST, payload: {
        request: {
          ...action, url: resolvedUrl
        },
        id,
      }
    });
  }
};


export const requestReducer = (state = {}, action) => {

  const {type, payload, meta, error} = action;

  switch (type) {
    case REGISTER_REQUEST: {
      const {
        action,
        paginationMapper = defaultPaginationMapper,
        sortMapper = defaultSortMapper,
        id,
        paginated = false
      } = payload;
      return assoc(id, {
        action,
        paginated,
        paginationMapper,
        sortMapper,
        id,
        loading: false,
        hasRun: false,
        hasError: false,
        hasData: false,
        data: {},
        error: {},
        filter: {},
        sort: {},
      }, state);
    }

    case CHANGE_REQUEST: {
      const {id, type, value} = payload;

      const oldVals = pathOr({}, [id, 'action', type], state);
      const newVals = reject(isNil, {...oldVals, ...value});
      return assocPath([id, 'action', type], newVals, state);
    }

    case SEND_REQUEST: {
      const {id} = payload;

      return assocPath([id, 'loading'], true, state);
    }

    case SEND_REQUEST_FAIL: {
      const id = path(['previousAction', 'payload', 'id'], meta);
      const prev = prop(id, state);
      const merger = {
        ...prev,
        loading: false,
        hasError: true,
        hasRun: true,
        error: error,
      };
      return assoc(id, merger, state);
    }

    case SEND_REQUEST_SUCCESS: {
      const id = path(['previousAction', 'payload', 'id'], meta);
      const prev = prop(id, state);
      const merger = {
        ...prev,
        loading: false,
        hasError: false,
        hasData: true,
        hasRun: true,
        data: prop('data', payload),
        error: {}
      };
      return assoc(id, merger, state);
    }

    case SET_FILTER: {
      const {id, filter: {value, field}} = payload;
      const f = pathOr({}, [id, 'filter'], state);
      const newF = reject(isNil, {...f, [field]: value});
      return assocPath([id, 'filter'], newF, state);
    }

    case RESET_FILTER: {
      const {id} = payload;
      return assocPath([id, 'filter'], {}, state);
    }

    case SET_SORT: {
      const {id, sort} = payload;
      const s = pathOr({}, [id, 'sort'], state);
      const {field, direction} = sort;
      const newS = reject(isNil, {...s, field, direction});
      return assocPath([id, 'sort'], newS, state);
    }

    default: {
      return state;
    }
  }

};
