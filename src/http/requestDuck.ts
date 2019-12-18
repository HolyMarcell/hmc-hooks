import {ChangeRequestAction, RegisterRequestAction, SendRequestAction, SetFilterAction} from "./types";
import {assoc, assocPath, has, isNil, path, pathOr, prop, reject} from "../util/ram";
import parseUrlSegments from "../util/parseUrlSegments";
import {config} from "../config";

export const REGISTER_REQUEST = 'http/useRequest/registerRequest';
export const CHANGE_REQUEST = 'http/useRequest/changeRequest';
export const SET_FILTER = 'http/useRequest/setFiler';
export const SEND_REQUEST = 'http/useRequest/sendRequest';
export const SEND_REQUEST_FAIL = 'http/useRequest/sendRequest_FAIL';
export const SEND_REQUEST_SUCCESS = 'http/useRequest/sendRequest_SUCCESS';

export const registerRequest = ({action, paginated, paginationMapper, id}: RegisterRequestAction) => {
  return {
    type: REGISTER_REQUEST,
    payload: {action, paginated, paginationMapper, id}
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

export const sendRequest = ({id}: SendRequestAction) => {
  return (dispatch, getState) => {

    const state = getState();
    const {segments, url, ...action} = pathOr({}, [config.reduxTopLevelKey, id, 'action'], state);

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
      const {action, paginated, paginationMapper, id} = payload;
      if(has(id, state)) { // -- no re-registering
        return state;
      }
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

      const vals = pathOr({}, [id, 'action', type], state);
      return assocPath([id, 'action', type], {...vals, ...value}, state);
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

    default: {
      return state;
    }
  }

};
