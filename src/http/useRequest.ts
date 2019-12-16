import {UseRequestApi, UseRequestProps} from "./types";
import rid from "../util/rid";
import {intersection, isEmpty, isNil, keys, last, prop} from "../util/ram";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from 'react-redux';
import {changeRequest, registerRequest, sendRequest} from "./requestDuck";

const useRequest = ({id = rid(), template}: UseRequestProps): UseRequestApi => {
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

  // -- Setup request
  useEffect(() => {
    dispatch(registerRequest({action, paginationMapper, paginated, id}));
  }, []);

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

  const go = () => {
    if(!depsResolved()) {
      return Promise.reject({error: {message: 'Dependencies not met', deps: {...deps.current}}});
    }

    const reqProm = dispatch(sendRequest({id})) as unknown as Promise<any>;
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
    dispatch(changeRequest({id, type: 'params', value: params}));
    resolveDeps(params);
  };

  const setSegments = (segments) => {
    dispatch(changeRequest({id, type: 'segments', value: segments}));
    resolveDeps(segments);
  };

  const setData = (data) => {
    dispatch(changeRequest({id, type: 'data', value: data}));
    resolveDeps(data);
  };

  const setHeaders = (headers) => {
    dispatch(changeRequest({id, type: 'headers', value: headers}));
    resolveDeps(headers);
  };

  return {
    go,
    id,
    setParams,
    setSegments,
    setData,
    setHeaders
  };
};


export default useRequest;
