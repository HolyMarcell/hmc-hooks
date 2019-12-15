import {ChangeRequestAction, RegisterRequestAction} from "./types";

export const REGISTER_REQUEST = 'http/useRequest/registerRequest';
export const CHANGE_REQUEST = 'http/useRequest/changeRequest';

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


export const requestReducer = (state = {}, action) => {

  const {type, payload} = action;

  switch(type) {
    case REGISTER_REQUEST: {
      const {action, paginated, paginationMapper, id} = payload;
      return state;
    }

    case CHANGE_REQUEST: {
      const {id, type, value} = payload;
      return state;
    }


    default: {
      return state;
    }
  }

};
