import {UseDataProps} from "./types";
import {selectRequestData} from "./useDataSelectors";
import {useSelector} from 'react-redux';


const useData = ({id}: UseDataProps) => {

  // @ts-ignore
  const d = useSelector((state) => selectRequestData(state, id));
  console.log(d);
  return d;
};

export default useData;
