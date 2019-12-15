import {createStore} from "redux";


export const saveActionsReducer = (state = [], action) => {

  if(action.type === 'RESET') {
    return [];
  }
  return state.concat(action);
};



const mockStore = createStore(saveActionsReducer) as any;

mockStore.getActions = () => {
  return mockStore.getState();
};

mockStore.reset = () => {
  mockStore.dispatch({type: 'RESET'});
};

export default mockStore;
