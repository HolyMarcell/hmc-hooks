import {Filter, Sort, UseMultiRequestApi, UseMultiRequestProps} from "./types";
import {isEmpty, isNil, keys, last, path, prop, propOr} from "../util/ram";
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
import {selectMultiData} from "./useDataSelectors";


export const useMultiRequest = (multiProps: UseMultiRequestProps): UseMultiRequestApi => {
  const selectors = keys(multiProps);

  for (const selector of selectors) {
    const {template, id} = prop(selector, multiProps);

    if (isNil(id)) {
      console.warn(`useMultiRequest (${selector}): id may not be null or empty`);
      return;
    }
    if (isNil(template) || isEmpty(template)) {
      console.warn(`useMultiRequest (${selector}): template may not be null or empty`);
      return;
    }
    const {action} = template;
    if (isNil(action) || isEmpty(action)) {
      console.warn(`useMultiRequest (${selector}): template.action may not be null or empty`);
      return;
    }
    if (isNil(prop('url', action)) || isEmpty(prop('url', action)) ||
      isNil(prop('method', action)) || isEmpty(prop('method', action))) {
      console.warn(`useMultiRequest (${selector}): template.action.url and template.action.method may not be null or empty`);
      return;
    }
  }


  const dispatch = useDispatch();

  // -- Setup request
  const isFirst = useRef(true);

  selectors.map((selector) => {
    const {template, id} = prop(selector, multiProps);
    const {action, paginationMapper, sortMapper, paginated} = template;

    dispatch(registerRequest({action, paginationMapper, sortMapper, paginated, id}));
  });

  const ids = selectors.map((selector) => path([selector, 'id'], multiProps));
  const multiData = useSelector((state) => selectMultiData(state, ids));

  // Try to return quickly if rerendering occurs
  const returnDefault = (force) => {
    if (!isFirst.current && !force) {
      return Promise.resolve();
    }
  }
  const goAll = (force = false) => {

    // -- run only once
    returnDefault(force);
    isFirst.current = false;
    const allRequests = selectors.map((selector) => {

      const id = path([selector, 'id'], multiProps);

      const reqProm = dispatch(sendRequest({id})) as unknown as Promise<any>;
      return reqProm.then((resultAction) => {
        const type = last(prop('type', resultAction).split('_'));
        if (type === 'FAIL') {
          return Promise.reject(prop('error', resultAction))
        }
        return {[selector]: prop('payload', resultAction)};
      });
    });

    return Promise.all(allRequests)
      .then((results) => {
        return results.reduce((acc: any, curr: any) => {
          return {
            ...acc,
            ...curr,
          }
        }, {});
      })
  };

  const go = (id) => (force = false) => {

    // -- run only once
    if (!isFirst.current && !force) {
      return Promise.resolve();
    }
    isFirst.current = false;

    const reqProm = dispatch(sendRequest({id})) as unknown as Promise<any>;
    return reqProm.then((resultAction) => {
      const type = last(prop('type', resultAction).split('_'));
      if (type === 'FAIL') {
        return Promise.reject(prop('error', resultAction))
      }
      return prop('payload', resultAction);
    });
  };

  const reload = (id) => () => {
    return go(id)(true);
  };

  // -- Setters

  const setParams = (id) => (params) => {
    dispatch(changeRequest({id, type: 'params', value: params}));
    return {go: reload(id)};
  };

  const setSegments = (id) => (segments) => {
    dispatch(changeRequest({id, type: 'segments', value: segments}));
    return {go: reload(id)};
  };

  const setData = (id) => (data) => {
    dispatch(changeRequest({id, type: 'data', value: data}));
    return {go: reload(id)};
  };

  const setHeaders = (id) => (headers) => {
    dispatch(changeRequest({id, type: 'headers', value: headers}));
    return {go: reload(id)};
  };

  const setFilter = (id) => (filter: Filter) => {
    dispatch(setPage({id, mod: () => 0}));
    dispatch(setFilterAction({id, filter}));
    return {go: reload(id)};
  };

  const resetFilters = (id) => () => {
    dispatch(setPage({id, mod: () => 0}));
    dispatch(resetFilterAction({id}));
    return {go: reload(id)};
  };

  const setSort = (id) => (sort: Sort) => {
    dispatch(setPage({id, mod: () => 0}));
    dispatch(setSortAction({id, sort}));
    return {go: reload(id)};
  };

  const setFile = (id) => (file: { [_: string]: File }) => {
    dispatch(changeRequest({id, type: 'file', value: file}));
    return {go: reload(id)};
  };

  const resetSort = (id) => () => {
    dispatch(setPage({id, mod: () => 0}));
    dispatch(resetSortAction({id}));
    return {go: reload(id)};
  };

  const onPageSelect = (id) => (page: number) => {
    dispatch(setPage({id, mod: () => page}));
    return {go: reload(id)};
  };

  const onNext = (id) => () => {
    dispatch(setPage({id, mod: (p) => p + 1}));
    return {go: reload(id)};
  };

  const onPrev = (id) => () => {
    dispatch(setPage({id, mod: (p) => p - 1}));
    return {go: reload(id)};
  };


  const res = selectors.reduce((acc, selector) => {
    const id = path([selector, 'id'], multiProps);
    const {pagination, filters, sort, ...requestData} =
      propOr({pagination: {}, filters: {}, sort: {}}, id, multiData);

    return {
      ...acc,
      [selector]: {
        go: go(id),
        reload: reload(id),
        id,
        setParams: setParams(id),
        setSegments: setSegments(id),
        setData: setData(id),
        setHeaders: setHeaders(id),
        setFile: setFile(id),
        filter: {
          setFilter: setFilter(id),
          resetFilters: resetFilters(id),
          filters
        },
        sort: {
          setSort: setSort(id),
          resetSort: resetSort(id),
          ...sort
        },
        pagination: {
          ...pagination,
          onNext: onNext(id),
          onPageSelect: onPageSelect(id),
          onPrev: onPrev(id)
        },
        ...requestData,
      }
    }

  }, {});


  return {
    goAll,
    ...res
  };
};


