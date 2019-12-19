import {UseDataProps} from "./types";
import {selectData} from "./useDataSelectors";
import {useSelector} from 'react-redux';


const useData = ({id}: UseDataProps) => {
  const data = useSelector((state) => selectData(state, id));

  return data;
};

export default useData;
 
