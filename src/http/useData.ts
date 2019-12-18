import {Filter, UseDataProps} from "./types";
import {selectData} from "./useDataSelectors";
import {useDispatch, useSelector} from 'react-redux';
import {isNil} from "../util/ram";


const useData = ({id}: UseDataProps) => {
  const dispatch = useDispatch();
  const {pagination, ...rest} = useSelector((state) => selectData(state, id));
  if (!isNil(pagination)) {
    const setFilter = (filter: Filter) => {
      dispatch()
    }
  }

  return rest;
};

export default useData;
