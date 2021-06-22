import {useRequest} from "../src";
import {Provider} from 'react-redux';
import {renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {mockId, mockTemplate} from "./util/mocks";
import React from "react";



describe('useRequest hook parameter check', () => {

  beforeEach(() => {
    mockStore.reset();
  });

  const runHook = (props) => {
    const Wrapper = ({children}) => (<Provider store={mockStore}>{children})</Provider>);
    const {result} = renderHook(() => useRequest(props), {wrapper: Wrapper});
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
});
