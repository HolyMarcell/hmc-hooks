import {useRequest} from "../src";
import {Provider} from 'react-redux';
import {act, renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {config} from "../src/config";
import {mockId, mockSortBy, mockTemplate} from "./util/mocks";
import {RESET_SORT, SET_SORT} from "../src/http/requestDuck";
import {SortMapper} from "../src/http/types";
import {sortMapToParams} from "../src/util/sortMapToParams";
import {defaultSortMapper} from "../src/util/defaultSortMapper";
import * as React from "react";


describe('useRequest hook sort', () => {

  beforeEach(() => {
    mockStore.reset();
  });

  const runHook = (props) => {
    const wrapper = ({children}) =>  React.createElement(Provider, {store: mockStore}, children);
    return renderHook(() => useRequest(props), {wrapper});
  };

  const getActions = (type) => {
    const actions = mockStore.getActions();
    return actions.filter((ac) => ac.type === type);
  };

  it('dispatches the sort action', async () => {
    const {result} = runHook({template: mockTemplate, id: mockId});

    await act(async () => {
      await result.current.go();
    });

    expect(result.current.sort.setSort).toBeDefined();

    await act(async () => {
      await result.current.sort.setSort(mockSortBy).go();
    });


    const actions = getActions(SET_SORT);
    expect(actions).toHaveLength(1);


    const state = mockStore.getState();
    expect(state[config.httpKey][mockId].sort).toBeDefined();
    expect(state[config.httpKey][mockId].sort).toEqual(mockSortBy);

  });


  it('sorting generates action-params', async () => {
    const {result} = runHook({template: mockTemplate, id: mockId});

    await act(async () => {
      await result.current.go();
    });

    const sortShape = {
      setSort: expect.any(Function),
    };

    expect(result.current.sort).toBeDefined();
    expect(result.current.sort).toEqual(expect.objectContaining(sortShape));

    await act(async () => {
      await result.current.sort.setSort(mockSortBy).go();
    });

    const sortParams = sortMapToParams(defaultSortMapper, mockSortBy);

    const state = mockStore.getState();
    expect(state[config.httpKey][mockId].sort).toBeDefined();
    expect(state[config.httpKey][mockId].action.params).toEqual(sortParams);

  });

  it('non-default sort mapper works', async () => {

    const customSortMapper: SortMapper = {
      asc: 'wacken',
      desc: 'dackel',
      direction: 'primel',
      field: 'flansch',
      strategy: 'two-field'
    };

    const {result} = runHook({template: {...mockTemplate, sortMapper: customSortMapper}});

    await act(async () => {
      await result.current.go();
    });

    const sortShape = {
      setSort: expect.any(Function),
    };

    expect(result.current.sort).toBeDefined();
    expect(result.current.sort).toEqual(expect.objectContaining(sortShape));

    await act(async () => {
      await result.current.sort.setSort(mockSortBy).go();
    });

    const sortParams = sortMapToParams(customSortMapper, mockSortBy);

    const state = mockStore.getState();
    expect(state[config.httpKey][result.current.id].sort).toBeDefined();
    expect(state[config.httpKey][result.current.id].action.params).toEqual(sortParams);

  });

  it('resetSort works', async () => {


    const {result} = runHook({template: {...mockTemplate}});

    await act(async () => {
      await result.current.go();
    });

    const sortShape = {
      resetSort: expect.any(Function),
    };


    expect(result.current.sort).toBeDefined();
    expect(result.current.sort).toEqual(expect.objectContaining(sortShape));

    await act(async () => {
      await result.current.sort.setSort(mockSortBy).go();
    });
    const sortParams = sortMapToParams(defaultSortMapper, mockSortBy);

    const state = mockStore.getState();
    expect(state[config.httpKey][result.current.id].sort).toBeDefined();
    expect(state[config.httpKey][result.current.id].action.params).toEqual(sortParams);

    await act(async () => {
      result.current.sort.resetSort().go();
    });

    const actions = getActions(RESET_SORT);
    expect(actions).toHaveLength(1);

    const state2 = mockStore.getState();
    expect(state2[config.httpKey][result.current.id].sort).toEqual({});
    expect(state2[config.httpKey][result.current.id].action.params).toEqual({});

  });



});

