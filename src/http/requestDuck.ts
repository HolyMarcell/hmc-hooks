import {
  ChangeRequestAction,
  PaginationMapper,
  RegisterRequestAction,
  SendRequestAction,
  SetFilterAction, SetPageAction,
  SetSortAction
} from "./types";
import {assoc, assocPath, has, isNil, path, pathOr, prop, reject} from "../util/ram";
import parseUrlSegments from "../util/parseUrlSegments";
import {config} from "../config";
import {selectAction, selectPageParam, selectPaginationMapper, selectRequest} from "./useDataSelectors";
import defaultPaginationMapper from "../util/defaultPaginationMapper";

export const REGISTER_REQUEST = 'http/useRequest/registerRequest';
export const CHANGE_REQUEST = 'http/useRequest/changeRequest';
export const SET_FILTER = 'http/useRequest/setFilter';
export const SET_SORT = 'http/useRequest/setSort';
export const SEND_REQUEST = 'http/useRequest/sendRequest';
export const SEND_REQUEST_FAIL = 'http/useRequest/sendRequest_FAIL';
export const SEND_REQUEST_SUCCESS = 'http/useRequest/sendRequest_SUCCESS';

export const registerRequest = ({action, paginated, paginationMapper, id}: RegisterRequestAction) => {

  return (dispatch, getState) => {
    const state = getState();
    const req = selectRequest(state, id);
    if(isNil(req)) {
      return dispatch(
        {
          type: REGISTER_REQUEST,
          payload: {action, paginated, paginationMapper, id}
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

    dispatch(changeRequest({id, type: 'params', value: filter}));
    return dispatch({
      type: SET_FILTER,
      payload: {id, filter}
    });
  }
};

export const setSort = ({id, sort}: SetSortAction) => {
  return (dispatch) => {

    dispatch(changeRequest({id, type: 'params', value: sort}));
    return dispatch({
      type: SET_FILTER,
      payload: {id, sort}
    });
  }
};

export const setPage = ({id, mod}: SetPageAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const mapper: PaginationMapper = selectPaginationMapper(state, id);
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
      const {action, paginated, paginationMapper = defaultPaginationMapper, id} = payload;
      return assoc(id, {
        action,
        paginated,
        paginationMapper,
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
      const {id, filter} = payload;
      const f = path([id, 'filter'], state);
      const newF = reject(isNil, {...f, ...filter});
      return assocPath([id, 'filter'], newF, state);
    }

    case SET_SORT: {
      const {id, sort} = payload;
      const s = path([id, 'sort'], state);
      const newS = reject(isNil, {...s, ...sort});
      return assocPath([id, 'sort'], newS, state);
    }

    default: {
      return state;
    }
  }

};
