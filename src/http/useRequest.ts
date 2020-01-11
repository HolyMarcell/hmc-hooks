import {Filter, Sort, UseRequestApi, UseRequestProps} from "./types";
import rid from "../util/rid";
import {intersection, isEmpty, isNil, keys, last, prop} from "../util/ram";
import {useEffect, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
  changeRequest,
  registerRequest,
  sendRequest,
  setFilter as setFilterAction, setPage,
  setSort as setSortAction
} from "./requestDuck";
import {selectData} from "./useDataSelectors";

const useRequest = ({id, template}: UseRequestProps): UseRequestApi => {
  if (isNil(template) || isEmpty(template)) {
    console.warn('useRequest: template may not be null or empty');
    return;
  }
  const {action, dependencies, paginated, paginationMapper} = template;
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

  dispatch(registerRequest({action, paginationMapper, paginated, id: requestId.current}));

  const {pagination, ...requestData} = useSelector((state) => selectData(state, requestId.current));

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
  const isGone = useRef(false);

  const go = (force = false) => {
    if (!depsResolved()) {
      return Promise.reject({error: {message: 'Dependencies not met', deps: {...deps.current}}});
    }

    // -- run only once
    if (isGone.current && !force) {
      return Promise.resolve();
    }
    isGone.current = true;

    const reqProm = dispatch(sendRequest({id: requestId.current})) as unknown as Promise<any>;
    return reqProm.then((resultAction) => {
      const type = last(prop('type', resultAction).split('_'));
      if (type === 'FAIL') {
        return Promise.reject(prop('error', resultAction))
      }
      return prop('payload', resultAction);
    });
  };


  // -- Setters

  const setParams = (params) => {
    dispatch(changeRequest({id: requestId.current, type: 'params', value: params}));
    isGone.current = false;
    resolveDeps(params);
    return {go};
  };

  const setSegments = (segments) => {
    dispatch(changeRequest({id: requestId.current, type: 'segments', value: segments}));
    isGone.current = false;
    resolveDeps(segments);
    return {go};
  };

  const setData = (data) => {
    dispatch(changeRequest({id: requestId.current, type: 'data', value: data}));
    isGone.current = false;
    resolveDeps(data);
    return {go};
  };

  const setHeaders = (headers) => {
    dispatch(changeRequest({id: requestId.current, type: 'headers', value: headers}));
    isGone.current = false;
    resolveDeps(headers);
    return {go};
  };

  const setFilter = (filter: Filter) => {
    dispatch(setFilterAction({id: requestId.current, filter}));
    isGone.current = false;
    return {go};
  };

  const setSort = (sort: Sort) => {
    dispatch(setSortAction({id: requestId.current, sort}));
    isGone.current = false;
    return {go};
  };

  const onPageSelect = (page: number) => {
    dispatch(setPage({id: requestId.current, mod: () => page}));
    isGone.current = false;
    return {go};
  };

  const onNext = () => {
    dispatch(setPage({id: requestId.current, mod: (p) => p + 1}));
    isGone.current = false;
    return {go};
  };

  const onPrev = () => {
    dispatch(setPage({id: requestId.current, mod: (p) => p - 1}));
    isGone.current = false;
    return {go};
  };

  return {
    // ...requestData,
    go,
    id,
    setParams,
    setSegments,
    setData,
    setHeaders,
    setFilter,
    setSort,
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
