import {useRequest} from "../src";
import {Provider} from 'react-redux';
import {act, renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {config} from "../src/config";
import {mockId, mockSortBy, mockTemplate} from "./util/mocks";
import {SET_SORT} from "../src/http/requestDuck";
import sortMapToParams from "../src/util/sortMapToParams";
import defaultSortMapper from "../src/util/defaultSortMapper";
import {SortMapper} from "../src/http/types";


describe('useRequest hook sort', () => {

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
    expect(state[config.reduxTopLevelKey][mockId].sort).toBeDefined();
    expect(state[config.reduxTopLevelKey][mockId].sort).toEqual(mockSortBy);

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
    expect(state[config.reduxTopLevelKey][mockId].sort).toBeDefined();
    expect(state[config.reduxTopLevelKey][mockId].action.params).toEqual(sortParams);

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
    expect(state[config.reduxTopLevelKey][result.current.id].sort).toBeDefined();
    expect(state[config.reduxTopLevelKey][result.current.id].action.params).toEqual(sortParams);

  });


});

