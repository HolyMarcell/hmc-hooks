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
import {
  mockHttpParam,
  mockId,
  mockResponse, mockResponseCustomPagination,
  mockTemplate,
  mockTemplateCustomPagination,
  mockTemplateFails
} from "./util/mocks";
import mock = jest.mock;



describe('useRequest hook paginations', () => {

  beforeEach(() => {
    mockStore.reset();
  });

  const runHook = (props) => {
    const wrapper = ({children}) => Provider({store: mockStore, children});
    return renderHook(() => useRequest(props), {wrapper});
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
    expect(state[config.reduxTopLevelKey][mockId]).toBeDefined();
    expect(state[config.reduxTopLevelKey][mockId].paginated).toEqual(true);

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
    expect(state[config.reduxTopLevelKey][result.current.id]).toBeDefined();
    expect(state[config.reduxTopLevelKey][result.current.id].paginated).toEqual(true);

    expect(result.current.pagination).toEqual(expect.objectContaining(expectedPagination));
  });


});

