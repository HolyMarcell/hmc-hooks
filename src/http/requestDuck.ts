import {RegisterRequestAction} from "./types";

export const REGISTER_REQUEST = 'http/useRequest/registerRequest';

export const registerRequest = ({action, paginated, paginationMapper, id}: RegisterRequestAction) => {
  return {
    type: REGISTER_REQUEST,
    payload: {action, paginated, paginationMapper, id}
  }
};


export const requestReducer = (state = {}, action) => {

  const {type, payload} = action;

  switch(type) {
    case REGISTER_REQUEST: {
      return state;
    }


  }

  return state;
};
