import {useRequest} from "../src";
import {Provider} from 'react-redux';
import {act, renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {config} from "../src/config";
import {mockFilterBy, mockId, mockTemplate} from "./util/mocks";
import {SET_FILTER} from "../src/http/requestDuck";
import React from "react";
import {Filter} from "../src/http/types";


describe('useRequest hook filter', () => {

  beforeEach(() => {
    mockStore.reset();
  });

  const runHook = (props) => {
    const Wrapper = ({children}) => (<Provider store={mockStore}>{children})</Provider>);
    return renderHook(() => useRequest(props), {wrapper: Wrapper});
  };

  const getActions = (type) => {
    const actions = mockStore.getActions();
    return actions.filter((ac) => ac.type === type);
  };

  it('dispatches the filter action', async () => {
    const {result} = runHook({template: mockTemplate, id: mockId});

    await act(async () => {
      await result.current.go();
    });

    expect(result.current.filter.setFilter).toBeDefined();

    await act(async () => {
      await result.current.filter.setFilter(mockFilterBy).go();
    });


    const actions = getActions(SET_FILTER);
    expect(actions).toHaveLength(1);

    const res = {[mockFilterBy.field]: mockFilterBy.value};

    const state = mockStore.getState();
    expect(state[config.httpKey][mockId].filter).toBeDefined();
    expect(state[config.httpKey][mockId].filter).toEqual(res);

  });


  it('filtering generates action-params', async () => {
    const {result} = runHook({template: mockTemplate, id: mockId});

    await act(async () => {
      await result.current.go();
    });

    const filterShape = {
      setFilter: expect.any(Function),
    };

    expect(result.current.filter).toBeDefined();
    expect(result.current.filter).toEqual(expect.objectContaining(filterShape));

    await act(async () => {
      await result.current.filter.setFilter(mockFilterBy).go();
    });

    const res = {[mockFilterBy.field]: mockFilterBy.value};

    const state = mockStore.getState();
    expect(state[config.httpKey][mockId].action.params).toBeDefined();
    expect(state[config.httpKey][mockId].action.params).toEqual(res);

  });

  it('filter results are correct', async () => {
    const {result} = runHook({template: mockTemplate});

    await act(async () => {
      await result.current.go();
    });

    const filterShape = {
      setFilter: expect.any(Function),
      resetFilters: expect.any(Function),
      // filters: expect.any
    };

    expect(result.current.filter).toBeDefined();
    expect(result.current.filter).toEqual(expect.objectContaining(filterShape));

    await act(async () => {
      await result.current.filter.setFilter(mockFilterBy).go();
    });
  });

  it('accepts multiple filters in a request', async () => {
    const {result} = runHook({template: mockTemplate});

    const multiFilter: Filter[] = [
      {
        value: 'zaphod',
        field: 'zarquon'
      },
      {
        value: 'acdc',
        field: 'rocknroll'
      }
    ]

    await act(async () => {
      await result.current.filter.setFilter(multiFilter).go();
    });

    const filterShape = {
      setFilter: expect.any(Function),
      resetFilters: expect.any(Function),
      // filters: expect.any
    };
  });

});

