import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {hasPath} from "ramda";
import {requestReducer, SEND_REQUEST_FAIL, SEND_REQUEST_SUCCESS} from "../../src/http/requestDuck";
import {config} from "../../src/config";
import {
  mockResponse,
  mockResponseCustomPagination,
  mockTemplate,
  mockTemplateCustomPagination,
  mockTemplateFails
} from "./mocks";
import {formReducer} from "../../src";


export const saveActionsReducer = (state = [], action) => {

  if (action.type === 'RESET') {
    return [];
  }
  return state.concat(action);
};

const fakeAxiosMiddleware = ({getState, dispatch}) => next => action => {
  if (!hasPath(['payload', 'request'], action)) {
    return next(action);
  }
  const isFailUrl = action.payload.request.url === mockTemplateFails.action.url;
  const isCustomPaginationUrl = action.payload.request.url === mockTemplateCustomPagination.action.url;
  const isDefaultUrl = action.payload.request.url === mockTemplate.action.url;
  const meta = {previousAction: {payload: {id: action.payload.id}}};

  // -- Diffrent urls: diffrent responses
  if (isFailUrl) {
    dispatch({type: SEND_REQUEST_FAIL, meta, error: {message: 'he he'}});
  }
  if (isCustomPaginationUrl) {
    dispatch({type: SEND_REQUEST_SUCCESS, meta, payload: {data: mockResponseCustomPagination}});
  }
  if (isDefaultUrl) {
    dispatch({type: SEND_REQUEST_SUCCESS, meta, payload: {data: mockResponse}});
  }

  next(action);

  // (!!!!!!) This promise is returned from the dispatch() call instead of the usual "action" object
  return Promise.resolve(action);

};

const mockStore = createStore(combineReducers({
  actions: saveActionsReducer,
  [config.httpKey]: requestReducer,
  [config.formKey]: formReducer,
}), applyMiddleware(fakeAxiosMiddleware, thunk)) as any;

mockStore.getActions = () => {
  return mockStore.getState().actions;
};

mockStore.reset = () => {
  mockStore.dispatch({type: 'RESET'});
};

export default mockStore;
