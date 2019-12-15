import {UseRequestApi, UseRequestProps} from "./types";
import rid from "../util/rid";
import {isEmpty, isNil, prop} from "../util/ram";
import {useEffect} from "react";
import {useDispatch} from 'react-redux';
import {registerRequest} from "./requestDuck";

const useRequest = ({id = rid(), template}: UseRequestProps): UseRequestApi => {
  if(isNil(template) || isEmpty(template)) {
    console.warn('useRequest: template may not be null or empty');
    return;
  }
  const {action, dependencies, paginated, paginationMapper} = template;
  if(isNil(action) || isEmpty(action)) {
    console.warn('useRequest: template.action may not be null or empty');
    return;
  }
  if(isNil(prop('url', action)) || isEmpty(prop('url', action)) ||
    isNil(prop('method', action)) || isEmpty(prop('method', action))) {
    console.warn('useRequest: template.action.url and template.action.method may not be null or empty');
    return;
  }

  const dispatch = useDispatch();

  // -- Setup request
  useEffect(() => {
    dispatch(registerRequest({action, paginationMapper, paginated, id}));
  }, []);

  return {
    go: () => Promise.resolve(),
    id
  };
};


export default useRequest;
