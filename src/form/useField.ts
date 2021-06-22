import {changeFieldProp, removeField as removeFieldAction, resetField, validateField} from "./formDuck";
import {useDispatch, useSelector} from 'react-redux';
import {selectField} from "./formSelectors";
import {UseFieldApi, UseFieldProps} from "./types";
import {prop} from "ramda";


export const useField = ({formId, name}: UseFieldProps): UseFieldApi => {
  const dispatch = useDispatch();
  const field: any = useSelector((state) => selectField(state, formId, name));

  const onChange = (value) => {

    dispatch(validateField({formId, name, value}));

    if(prop('touched', field) !== true) {
      dispatch(changeFieldProp({formId, name, prop: 'touched', value: true}));
    }

    return dispatch(changeFieldProp({formId, name, prop: 'value', value}));
  };

  const removeField = () => {
    return dispatch(removeFieldAction({formId, name}));
  };

  const reset = () => {
    return dispatch(resetField({formId, name}));
  };

  return {
    ...field,
    onChange,
    removeField,
    formId,
    reset,
  };
};

