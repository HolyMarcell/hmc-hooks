import {Filter, Sort, UseRequestApi, UseRequestProps} from "./types";
import rid from "../util/rid";
import {contains, isEmpty, isNil, last, prop} from "../util/ram";
import {useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
  changeRequest,
  registerRequest,
  resetFilter as resetFilterAction,
  resetSort as resetSortAction,
  sendRequest,
  setFilter as setFilterAction,
  setPage,
  setSort as setSortAction
} from "./requestDuck";
import {selectData} from "./useDataSelectors";

const useRequest = ({id, template}: UseRequestProps): UseRequestApi => {
  if (isNil(template) || isEmpty(template)) {
    console.warn('useRequest: template may not be null or empty');
    return;
  }
  const {action, paginated, paginationMapper, sortMapper, reloadOn = []} = template;
  if (isNil(action) || isEmpty(action)) {
    console.warn('useRequest: template.action may not be null or empty');
    return;
  }
  if (isNil(prop('url', action)) || isEmpty(prop('url', action)) ||
    isNil(prop('method', action)) || isEmpty(prop('method', action))) {
    console.warn('useRequest: template.action.url and template.action.method may not be null or empty');
    return;
  }

  const dispatch = useDispatch();

  // -- Setup request
  const requestId = useRef(id);
  const isFirst = useRef(true);
  requestId.current = isNil(requestId.current) ? rid() : requestId.current;
  dispatch(registerRequest({action, paginationMapper, sortMapper, paginated, id: requestId.current}));

  const {pagination, sort: sortData, filter: filterData, ...requestData} =
    useSelector((state) => selectData(state, requestId.current));



  const go = (force = false) => {

    // -- run only once
    if (!isFirst.current && !force) {
      return Promise.resolve();
    }
    isFirst.current = false;

    const reqProm = dispatch(sendRequest({id: requestId.current})) as unknown as Promise<any>;
    return reqProm.then((resultAction) => {
      const type = last(prop('type', resultAction).split('_'));
      if (type === 'FAIL') {
        return Promise.reject(prop('error', resultAction))
      }
      return prop('payload', resultAction);
    });
  };

  const reload = () => {
    return go(true);
  };

  // -- Setters

  const setParams = (params) => {
    dispatch(changeRequest({id: requestId.current, type: 'params', value: params}));
    if (contains('params', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const setSegments = (segments) => {
    dispatch(changeRequest({id: requestId.current, type: 'segments', value: segments}));
    if (contains('segments', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const setData = (data) => {
    dispatch(changeRequest({id: requestId.current, type: 'data', value: data}));
    if (contains('data', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const setHeaders = (headers) => {
    dispatch(changeRequest({id: requestId.current, type: 'headers', value: headers}));
    if (contains('headers', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const setFilter = (filter: Filter) => {
    dispatch(setPage({id: requestId.current, mod: () => 0}));
    dispatch(setFilterAction({id: requestId.current, filter}));
    if (contains('filter', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const resetFilters = () => {
    dispatch(setPage({id: requestId.current, mod: () => 0}));
    dispatch(resetFilterAction({id: requestId.current}));
    if (contains('filter', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const setSort = (sort: Sort) => {
    dispatch(setPage({id: requestId.current, mod: () => 0}));
    dispatch(setSortAction({id: requestId.current, sort}));
    if (contains('sort', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const setFile = (file: { [_: string]: File }) => {
    dispatch(changeRequest({id: requestId.current, type: 'file', value: file}));
    if (contains('headers', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const resetSort = () => {
    dispatch(setPage({id: requestId.current, mod: () => 0}));
    dispatch(resetSortAction({id: requestId.current}));
    if (contains('sort', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const onPageSelect = (page: number) => {
    dispatch(setPage({id: requestId.current, mod: () => page}));
    if (contains('pagination', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const onNext = () => {
    dispatch(setPage({id: requestId.current, mod: (p) => p + 1}));
    if (contains('pagination', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const onPrev = () => {
    dispatch(setPage({id: requestId.current, mod: (p) => p - 1}));
    if (contains('pagination', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  return {
    go,
    reload,
    id: requestId.current,
    setParams,
    setSegments,
    setData,
    setHeaders,
    setFile,
    filter: {
      setFilter,
      resetFilters,
      filters: filterData
    },
    sort: {
      setSort,
      resetSort,
      ...sortData
    },
    pagination: {
      ...pagination,
      onNext,
      onPageSelect,
      onPrev
    },
    ...requestData,
  };
};


export default useRequest;
