import {useRequest} from "../src";
import {Provider} from 'react-redux';
import {act, renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {config} from "../src/config";
import {
  mockId,
  mockResponse,
  mockResponseCustomPagination,
  mockTemplate,
  mockTemplateCustomPagination
} from "./util/mocks";
import React from "react";


describe('useRequest hook paginations', () => {

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


  it('generates mapped pagination data if "is paginated"', async () => {
    const tpl = {...mockTemplate, paginated: true, action: {...mockTemplate.action}};
    const {result} = runHook({template: tpl, id: mockId});

    await act(async () => {
      await result.current.go();
    });


    const expectedPagination = {
      page: mockResponse.index, // -- renaming done by "defaultPaginationMapper"
      totalElements: mockResponse.totalElements,
      totalPages: mockResponse.totalPages,
      size: mockResponse.size,
      numberOfElements: mockResponse.numberOfElements,
    };


    const state = mockStore.getState();
    expect(state[config.httpKey][mockId]).toBeDefined();
    expect(state[config.httpKey][mockId].paginated).toEqual(true);

    expect(result.current.pagination).toEqual(expect.objectContaining(expectedPagination));
  });





  it('maps all parts of pagination correctly from data', async () => {
    const {result} = runHook({template: mockTemplateCustomPagination});

    await act(async () => {
      await result.current.go();
    });


    const expectedPagination = {
      page: mockResponseCustomPagination.indexFoo,
      totalElements: mockResponseCustomPagination.total.elementsFoo,
      totalPages: mockResponseCustomPagination.total.pagesFoo,
      size: mockResponseCustomPagination.sizeFoo,
      numberOfElements: mockResponseCustomPagination.numberOfElementsFoo,
    };

    const state = mockStore.getState();
    expect(state[config.httpKey][result.current.id]).toBeDefined();
    expect(state[config.httpKey][result.current.id].paginated).toEqual(true);

    expect(result.current.pagination).toEqual(expect.objectContaining(expectedPagination));
  });


});

