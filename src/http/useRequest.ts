import {Filter, Sort, UseRequestApi, UseRequestProps} from "./types";
import rid from "../util/rid";
import {contains, intersection, isEmpty, isNil, keys, last, prop} from "../util/ram";
import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
  changeRequest,
  registerRequest,
  sendRequest,
  setFilter as setFilterAction,
  resetFilter as resetFilterAction,
  setPage,
  setSort as setSortAction,
  resetSort as resetSortAction
} from "./requestDuck";
import {selectData} from "./useDataSelectors";

const useRequest = ({id, template}: UseRequestProps): UseRequestApi => {
  if (isNil(template) || isEmpty(template)) {
    console.warn('useRequest: template may not be null or empty');
    return;
  }
  const {action, dependencies, paginated, paginationMapper, sortMapper, reloadOn = []} = template;
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
  const requestId = useRef(id);

  // -- Setup request
  requestId.current = isNil(requestId.current) ? rid() : requestId.current;

  dispatch(registerRequest({action, paginationMapper, sortMapper, paginated, id: requestId.current}));

  const {pagination, sort: sortData, filter: filterData, ...requestData} = useSelector((state) => selectData(state, requestId.current));
  // -- Setup dependencies

  const deps = useRef({});
  // -- helpers
  const resolveDeps = (values) => {
    const changedDeps = intersection(keys(values), keys(deps.current));
    if (changedDeps.length > 0) {
      changedDeps.map((name) => {
        deps.current[name] = true;
      });
    }
  };
  const depsResolved = () => {
    return keys(deps.current).reduce((acc, name) => {
      return acc && deps.current[name]
    }, true);
  };
  // -- init
  useEffect(() => {
    if (!isNil(dependencies) && dependencies.length > 0) {
      deps.current = dependencies.reduce((acc, key) => {
        return {...acc, [key]: false}
      }, {});
    }
  }, []);

  // -- Fire request if all deps are resolved
  const isFirst = useRef(true);

  const go = (force = false) => {
    if (!depsResolved()) {
      return Promise.reject({error: {message: 'Dependencies not met', deps: {...deps.current}}});
    }

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
    if(contains('params', reloadOn)) {
      reload()
    }
    resolveDeps(params);
    return {go: reload};
  };

  const setSegments = (segments) => {
    dispatch(changeRequest({id: requestId.current, type: 'segments', value: segments}));
    if(contains('segments', reloadOn)) {
      reload()
    }
    resolveDeps(segments);
    return {go: reload};
  };

  const setData = (data) => {
    dispatch(changeRequest({id: requestId.current, type: 'data', value: data}));
    if(contains('data', reloadOn)) {
      reload()
    }
    resolveDeps(data);
    return {go: reload};
  };

  const setHeaders = (headers) => {
    dispatch(changeRequest({id: requestId.current, type: 'headers', value: headers}));
    if(contains('headers', reloadOn)) {
      reload()
    }
    resolveDeps(headers);
    return {go: reload};
  };

  const setFilter = (filter: Filter) => {
    dispatch(setPage({id: requestId.current, mod: () => 0}));
    dispatch(setFilterAction({id: requestId.current, filter}));
    if(contains('filter', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const resetFilters = () => {
    dispatch(setPage({id: requestId.current, mod: () => 0}));
    dispatch(resetFilterAction({id: requestId.current}));
    if(contains('filter', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const setSort = (sort: Sort) => {
    dispatch(setPage({id: requestId.current, mod: () => 0}));
    dispatch(setSortAction({id: requestId.current, sort}));
    if(contains('sort', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const resetSort = () => {
    dispatch(setPage({id: requestId.current, mod: () => 0}));
    dispatch(resetSortAction({id: requestId.current}));
    if(contains('sort', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const onPageSelect = (page: number) => {
    dispatch(setPage({id: requestId.current, mod: () => page}));
    if(contains('pagination', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const onNext = () => {
    dispatch(setPage({id: requestId.current, mod: (p) => p + 1}));
    if(contains('pagination', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  const onPrev = () => {
    dispatch(setPage({id: requestId.current, mod: (p) => p - 1}));
    if(contains('pagination', reloadOn)) {
      reload()
    }
    return {go: reload};
  };

  return {
    // ...requestData,
    go,
    reload,
    id: requestId.current,
    setParams,
    setSegments,
    setData,
    setHeaders,
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
