import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {hasPath} from "../../src/util/ram";
import {requestReducer, SEND_REQUEST_FAIL, SEND_REQUEST_SUCCESS} from "../../src/http/requestDuck";
import {mockResponse, mockTemplateFails} from "../useRequest.spec";
import {config} from "../../src/config";


export const saveActionsReducer = (state = [], action) => {

  if(action.type === 'RESET') {
    return [];
  }
  return state.concat(action);
};

const fakeAxiosMiddleware = ({getState, dispatch}) => next => action => {
  if (!hasPath(['payload', 'request'], action)) {
    return next(action);
  }
  const isFailUrl = action.payload.request.url === mockTemplateFails.action.url;
  const meta = {previousAction: {payload: {id: action.payload.id}}};
  if(isFailUrl) {
    dispatch({type: SEND_REQUEST_FAIL, meta, error: {message: 'he he'}});
  } else {
    dispatch({type: SEND_REQUEST_SUCCESS, meta, payload: {data: mockResponse}});
  }
  next(action);

  // (!!!!!!) This promise is returned from the dispatch() call instead of the usual "action" object
  return Promise.resolve(action);

};

const mockStore = createStore(combineReducers({
  actions: saveActionsReducer,
  [config.reduxTopLevelKey]: requestReducer,
}), applyMiddleware(fakeAxiosMiddleware, thunk)) as any;

mockStore.getActions = () => {
  return mockStore.getState().actions;
};

mockStore.reset = () => {
  mockStore.dispatch({type: 'RESET'});
};

export default mockStore;
