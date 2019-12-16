import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {has, hasPath} from "../../src/util/ram";
import {requestReducer} from "../../src/http/requestDuck";


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

  next(action);

  // (!!!!!!) This promise is returned from the dispatch() call instead of the usual "action" object
  return Promise.resolve(action);

};

const mockStore = createStore(combineReducers({
  actions: saveActionsReducer,
  http: requestReducer,
}), applyMiddleware(fakeAxiosMiddleware, thunk)) as any;

mockStore.getActions = () => {
  return mockStore.getState().actions;
};

mockStore.reset = () => {
  mockStore.dispatch({type: 'RESET'});
};

export default mockStore;
