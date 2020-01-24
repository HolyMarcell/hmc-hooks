import {defaultPaginationMapper, useRequest} from "../src";
import {Provider} from 'react-redux';
import {renderHook, act} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {
  CHANGE_REQUEST,
  REGISTER_REQUEST,
  SEND_REQUEST,
  SEND_REQUEST_FAIL,
  SEND_REQUEST_SUCCESS
} from "../src/http/requestDuck";
import {config} from "../src/config";
import {mockHttpParam, mockId, mockResponse, mockTemplate, mockTemplateFails} from "./util/mocks";



describe('useRequest hook behavior', () => {

  beforeEach(() => {
    mockStore.reset();
  });

  const runHook = (props) => {
    const wrapper = ({children}) => Provider({store: mockStore, children});
    const {result} = renderHook(() => useRequest(props), {wrapper});
    return result.current;
  };

  const getActions = (type) => {
    const actions = mockStore.getActions();
    return actions.filter((ac) => ac.type === type);
  };


  it('dispatches the register action once', () => {
    runHook({template: mockTemplate, id: mockId});

    const actions = getActions(REGISTER_REQUEST);

    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual(REGISTER_REQUEST);

    const state = mockStore.getState();
    expect(state[config.httpKey][mockId]).toBeDefined();
    expect(state[config.httpKey][mockId].action).toEqual(mockTemplate.action);
    expect(state[config.httpKey][mockId].paginated).toEqual(false);
    expect(state[config.httpKey][mockId].paginationMapper).toEqual(defaultPaginationMapper);
  });


  it('dispatches set param action', () => {
    const api = runHook({template: mockTemplate, id: mockId});
    api.setParams(mockHttpParam);

    const actions = getActions(CHANGE_REQUEST);

    expect(actions.length).toEqual(1);
    expect(actions[0].payload.value).toEqual(mockHttpParam);
    expect(actions[0].payload.id).toEqual(mockId);
    expect(actions[0].payload.type).toEqual('params');

    const state = mockStore.getState();
    expect(state[config.httpKey][api.id].action.params).toEqual(mockHttpParam);

  });

  it('dispatches set header action', () => {
    const api = runHook({template: mockTemplate});
    api.setHeaders(mockHttpParam);

    const actions = getActions(CHANGE_REQUEST);

    expect(actions.length).toEqual(1);
    expect(actions[0].payload.value).toEqual(mockHttpParam);
    expect(actions[0].payload.id).toEqual(api.id);
    expect(actions[0].payload.type).toEqual('headers');

    const state = mockStore.getState();
    expect(state[config.httpKey][api.id].action.headers).toEqual(mockHttpParam);
  });

  it('dispatches set data action', () => {
    const api = runHook({template: mockTemplate, id: mockId});
    api.setData(mockHttpParam);

    const actions = getActions(CHANGE_REQUEST);

    expect(actions.length).toEqual(1);
    expect(actions[0].payload.value).toEqual(mockHttpParam);
    expect(actions[0].payload.id).toEqual(mockId);
    expect(actions[0].payload.type).toEqual('data');

    const state = mockStore.getState();
    expect(state[config.httpKey][api.id].action.data).toEqual(mockHttpParam);
  });

  it('dispatches set segmment action', () => {
    const api = runHook({template: mockTemplate});
    api.setSegments(mockHttpParam);

    const actions = getActions(CHANGE_REQUEST);

    expect(actions.length).toEqual(1);
    expect(actions[0].payload.value).toEqual(mockHttpParam);
    expect(actions[0].payload.id).toEqual(api.id);
    expect(actions[0].payload.type).toEqual('segments');

    const state = mockStore.getState();
    expect(state[config.httpKey][api.id].action.segments).toEqual(mockHttpParam);
  });

  it('dispatches go action', async () => {
    const api = runHook({template: mockTemplate});
    await act(async () => {
      await api.go()
    });

    const actions = getActions(SEND_REQUEST);

    expect(actions.length).toEqual(1);
    expect(actions[0].payload.id).toEqual(api.id);

    const state = mockStore.getState();
    expect(state[config.httpKey][api.id].loading).toEqual(true);
    expect(state[config.httpKey][api.id].data).toBeDefined();
    expect(state[config.httpKey][api.id].hasError).toEqual(false);
    expect(state[config.httpKey][api.id].hasData).toEqual(true);
    expect(state[config.httpKey][api.id].error).toEqual({});
  });

  it('sets data correctly', async () => {
    const api = runHook({template: mockTemplate});
    await act(async () => {
      await api.go()
    });

    const actions = getActions(SEND_REQUEST_SUCCESS);

    expect(actions.length).toEqual(1);
    expect(actions[0].meta.previousAction.payload.id).toEqual(api.id)

    const state = mockStore.getState();
    expect(state[config.httpKey][api.id].data).toEqual(mockResponse);
  });


  it('sets error correctly', async () => {
    const api = runHook({template: mockTemplateFails});
    await act(async () => {
      await api.go()
    });

    const actions = getActions(SEND_REQUEST_FAIL);

    expect(actions.length).toEqual(1);
    expect(actions[0].meta.previousAction.payload.id).toEqual(api.id);

    const state = mockStore.getState();
    expect(state[config.httpKey][api.id].data).toEqual({});
    expect(state[config.httpKey][api.id].hasError).toEqual(true);
    expect(state[config.httpKey][api.id].error).toBeDefined();
    expect(state[config.httpKey][api.id].error).not.toEqual({});
  });


});

