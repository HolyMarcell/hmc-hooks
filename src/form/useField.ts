import {changeFieldProp, resetField} from "./formDuck";
import {useDispatch, useSelector} from 'react-redux';
import {selectField} from "./formSelectors";
import {UseFieldApi, UseFieldProps} from "./types";
import {isNil, prop} from "../util/ram";


const useField = ({formId, name, validator, asyncValidator}: UseFieldProps): UseFieldApi => {
  const dispatch = useDispatch();
  const field = useSelector((state) => selectField(state, formId, name));

  const onChange = (value) => {
    if (!isNil(validator)) {
      dispatch(changeFieldProp({formId, name, prop: 'valid', value: validator(value)}))
    }

    if (!isNil(asyncValidator)) {
      asyncValidator(value)
        .then((isValid) => {
          dispatch(changeFieldProp({formId, name, prop: 'valid', value: isValid}))
        })
    }

    const dirty = isNil(prop('initialValue', field)) ? true : value !== prop('initialValue', field);
    dispatch(changeFieldProp({formId, name, prop: 'dirty', value: dirty}));

    if(prop('touched', field) !== true) {
      dispatch(changeFieldProp({formId, name, prop: 'touched', value: true}));
    }

    return dispatch(changeFieldProp({formId, name, prop: 'value', value}));
  };

  const reset = () => {
    return dispatch(resetField({formId, name}));
  };

  return {
    ...field,
    onChange,
    formId,
    reset,
  };
};

export default useField;
