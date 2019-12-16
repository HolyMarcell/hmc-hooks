import {ChangeRequestAction, RegisterRequestAction, SendRequestAction} from "./types";
import {assoc, assocPath, pathOr} from "../util/ram";
import parseUrlSegments from "../util/parseUrlSegments";

export const REGISTER_REQUEST = 'http/useRequest/registerRequest';
export const CHANGE_REQUEST = 'http/useRequest/changeRequest';
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

export const sendRequest = ({id}: SendRequestAction) => {
  return (dispatch, getState) => {

    const state = getState();
    const {segments, url, ...action} = pathOr({}, ['http', id, 'action'], state);

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

  const {type, payload} = action;

  switch (type) {
    case REGISTER_REQUEST: {
      const {action, paginated, paginationMapper, id} = payload;
      return assoc(id, {
        action,
        paginated,
        paginationMapper,
        id,
        isLoading: false,
        hasRun: false,
        hasError: false,
        hasData: false,
        data: {},
        error: {}
      }, state);
    }

    case CHANGE_REQUEST: {
      const {id, type, value} = payload;

      const vals = pathOr({}, [id, 'action', type], state);
      return assocPath([id, 'action', type], {...vals, ...value}, state);
    }

    case SEND_REQUEST: {
      const {id} = payload;

      return assocPath([id, 'isLoading'], true, state);
    }

    case SEND_REQUEST_FAIL: {

      return state;
    }

    case SEND_REQUEST_SUCCESS: {
      return state;
    }

    default: {
      return state;
    }
  }

};
