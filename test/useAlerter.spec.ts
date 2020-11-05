import {useAlerter} from "../src/http/useAlerter";
import mockStore from "./util/mockStore";
import {renderHook} from "@testing-library/react-hooks";
import {useForm} from "../src";


describe('useAlerter hook', () => {


  const runHook = (props) => {
    const {result} = renderHook(() => useAlerter(props));
    return result.current;
  };


  it('does something', () => {

    const alerterApi = runHook({msg: "hello world"});
    expect(alerterApi).toHaveProperty('now');
  });

});
