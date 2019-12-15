import {useRequest} from "../src";
import {Provider} from 'react-redux';
import { renderHook } from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {CHANGE_REQUEST, REGISTER_REQUEST} from "../src/http/requestDuck";



const mockTemplate = {
  action: {
    url: 'http://example.com',
    method: 'GET'
  }
};
const mockId = 'by-the-great-prophet-zarquon';
const mockHttpParam = {fnord: 'istdasechoderstille'};

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
    expect(changeReq[0].payload.type).toEqual('param');
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
    expect(changeReq[0].payload.type).toEqual('header');
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
    expect(changeReq[0].payload.type).toEqual('segment');
  });


});

