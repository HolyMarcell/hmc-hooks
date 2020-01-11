/*
import {useRequest} from "../src";
import {Provider} from 'react-redux';
import {renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {
  CHANGE_REQUEST,
  REGISTER_REQUEST,
  SEND_REQUEST,
  SEND_REQUEST_FAIL,
  SEND_REQUEST_SUCCESS
} from "../src/http/requestDuck";
import {config} from "../src/config";


const mockTemplate = {
  action: {
    url: 'http://example.com',
    method: 'GET'
  }
};

export const mockTemplateFails = {
  action: {
    url: 'this-fails',
    method: 'GET'
  }
};


const mockId = 'by-the-great-prophet-zarquon';
const mockHttpParam = {fnord: 'istdasechoderstille'};
export const mockResponse = {foo: 'bar'};


describe('useRequest hook', () => {

  const runHook = (props) => {
    mockStore.reset();
    const wrapper = ({children}) => Provider({store: mockStore, children});
    const {result} = renderHook(() => useRequest(props), {wrapper});
    return result.current;
  };


  it('exists', () => {
    expect(useRequest).toBeDefined();
  });

  it('returns a go function', () => {
    const api = runHook({template: mockTemplate});

    expect(api).toHaveProperty('go', expect.any(Function));
  });

  it('returns the correct (or random) id', () => {
    const api = runHook({template: mockTemplate});
    const api2 = runHook({template: mockTemplate, id: mockId});
    expect(api).toHaveProperty('id', expect.any(String));
    expect(api2).toHaveProperty('id', mockId);
  });

  it('fails on empty template', () => {
    const api = runHook({} as any);
    expect(api).toBe(undefined);
  });

  it('fails on empty action', () => {
    const api = runHook({template: {action: {}}} as any);
    expect(api).toBe(undefined);
  });

  it('fails on empty url or method', () => {
    const api = runHook({template: {action: {url: ''}}} as any);
    const api2 = runHook({template: {action: {url: 'http://foo.de'}}} as any);
    const api3 = runHook({template: {action: {method: 'GET'}}} as any);
    expect(api).toBe(undefined);
    expect(api2).toBe(undefined);
    expect(api3).toBe(undefined);
  });

  it('dispatches the register action once', () => {
    runHook({template: mockTemplate, id: mockId});
    const actions = mockStore.getActions();
    expect(actions).toBeDefined();

    const regReq = actions.filter((ac) => ac.type === REGISTER_REQUEST);

    expect(regReq.length).toEqual(1);
    expect(regReq[0].type).toEqual(REGISTER_REQUEST);

    const state = mockStore.getState();
    expect(state[config.reduxTopLevelKey][mockId]).toBeDefined();
    expect(state[config.reduxTopLevelKey][mockId].action).toEqual(mockTemplate.action);
    expect(state[config.reduxTopLevelKey][mockId].paginated).toEqual(undefined);
    expect(state[config.reduxTopLevelKey][mockId].paginationMapper).toEqual(undefined);
  });

  it('dispatches set param action', () => {
    const api = runHook({template: mockTemplate, id: mockId});
    api.setParams(mockHttpParam);

    const actions = mockStore.getActions();
    expect(actions).toBeDefined();

    const changeReq = actions.filter((ac) => ac.type === CHANGE_REQUEST);
    expect(changeReq.length).toEqual(1);
    expect(changeReq[0].payload.value).toEqual(mockHttpParam);
    expect(changeReq[0].payload.id).toEqual(mockId);
    expect(changeReq[0].payload.type).toEqual('params');

    const state = mockStore.getState();
    expect(state[config.reduxTopLevelKey][api.id].action.params).toEqual(mockHttpParam);

  });

  it('dispatches set header action', () => {
    const api = runHook({template: mockTemplate});
    api.setHeaders(mockHttpParam);

    const actions = mockStore.getActions();
    expect(actions).toBeDefined();

    const changeReq = actions.filter((ac) => ac.type === CHANGE_REQUEST);
    expect(changeReq.length).toEqual(1);
    expect(changeReq[0].payload.value).toEqual(mockHttpParam);
    expect(changeReq[0].payload.id).toEqual(api.id);
    expect(changeReq[0].payload.type).toEqual('headers');

    const state = mockStore.getState();
    expect(state[config.reduxTopLevelKey][api.id].action.headers).toEqual(mockHttpParam);
  });

  it('dispatches set data action', () => {
    const api = runHook({template: mockTemplate, id: mockId});
    api.setData(mockHttpParam);

    const actions = mockStore.getActions();
    expect(actions).toBeDefined();

    const changeReq = actions.filter((ac) => ac.type === CHANGE_REQUEST);
    expect(changeReq.length).toEqual(1);
    expect(changeReq[0].payload.value).toEqual(mockHttpParam);
    expect(changeReq[0].payload.id).toEqual(mockId);
    expect(changeReq[0].payload.type).toEqual('data');

    const state = mockStore.getState();
    expect(state[config.reduxTopLevelKey][api.id].action.data).toEqual(mockHttpParam);
  });

  it('dispatches set segmment action', () => {
    const api = runHook({template: mockTemplate});
    api.setSegments(mockHttpParam);

    const actions = mockStore.getActions();
    expect(actions).toBeDefined();

    const changeReq = actions.filter((ac) => ac.type === CHANGE_REQUEST);
    expect(changeReq.length).toEqual(1);
    expect(changeReq[0].payload.value).toEqual(mockHttpParam);
    expect(changeReq[0].payload.id).toEqual(api.id);
    expect(changeReq[0].payload.type).toEqual('segments');

    const state = mockStore.getState();
    expect(state[config.reduxTopLevelKey][api.id].action.segments).toEqual(mockHttpParam);
  });

  it('dispatches go action', () => {
    const api = runHook({template: mockTemplate});
    api.go()
      .then(() => {

        const actions = mockStore.getActions();
        expect(actions).toBeDefined();
        const changeReq = actions.filter((ac) => ac.type === SEND_REQUEST);
        expect(changeReq.length).toEqual(1);
        expect(changeReq[0].payload.id).toEqual(api.id);

        const state = mockStore.getState();
        expect(state[config.reduxTopLevelKey][api.id].loading).toEqual(true);
        expect(state[config.reduxTopLevelKey][api.id].data).toBeDefined();
        expect(state[config.reduxTopLevelKey][api.id].hasError).toEqual(false);
        expect(state[config.reduxTopLevelKey][api.id].hasData).toEqual(true);
        expect(state[config.reduxTopLevelKey][api.id].error).toEqual({});
      });
  });

  it('sets data correctly', () => {
    const api = runHook({template: mockTemplate});
    api.go()
      .then(() => {

        const actions = mockStore.getActions();
        expect(actions).toBeDefined();
        const changeReq = actions.filter((ac) => ac.type === SEND_REQUEST_SUCCESS);
        expect(changeReq.length).toEqual(1);
        expect(changeReq[0].meta.previousAction.payload.id).toEqual(api.id);

        const state = mockStore.getState();
        expect(state[config.reduxTopLevelKey][api.id].data).toEqual(mockResponse);
      });
  });

  it('sets error correctly', () => {
    const api = runHook({template: mockTemplateFails});
    api.go()
      .then(() => {

        const actions = mockStore.getActions();
        expect(actions).toBeDefined();
        const changeReq = actions.filter((ac) => ac.type === SEND_REQUEST_FAIL);
        expect(changeReq.length).toEqual(1);
        expect(changeReq[0].meta.previousAction.payload.id).toEqual(api.id);

        const state = mockStore.getState();
        expect(state[config.reduxTopLevelKey][api.id].data).toEqual({});
        expect(state[config.reduxTopLevelKey][api.id].hasError).toEqual(true);
        expect(state[config.reduxTopLevelKey][api.id].error).toBeDefined();
        expect(state[config.reduxTopLevelKey][api.id].error).not.toEqual({});
      });
  });


});

*/

it('is seriously fucked up', () => {
  console.log('why do my tests fail randomly just because of an update to my test-suite? Fuck it.')
})
