import {useRequest} from "../src";
import {Provider} from 'react-redux';
import {act, renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {config} from "../src/config";
import {mockFilterBy, mockId, mockSortBy, mockTemplate} from "./util/mocks";
import {SET_FILTER, SET_SORT} from "../src/http/requestDuck";
import sortMapToParams from "../src/util/sortMapToParams";
import defaultSortMapper from "../src/util/defaultSortMapper";
import {SortMapper} from "../src/http/types";


fdescribe('useRequest hook filter', () => {

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
    expect(state[config.reduxTopLevelKey][mockId].filter).toBeDefined();
    expect(state[config.reduxTopLevelKey][mockId].filter).toEqual(res);

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
    expect(state[config.reduxTopLevelKey][mockId].action.params).toBeDefined();
    expect(state[config.reduxTopLevelKey][mockId].action.params).toEqual(res);

  });


});

