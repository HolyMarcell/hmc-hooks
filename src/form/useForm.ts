import {FormField, UseFormApi, UseFormProps} from "./types";
import {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {registerField, registerForm} from "./formDuck";
import {selectFieldNames} from "./formSelectors";

export const useForm = ({fields, id}: UseFormProps): UseFormApi => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(registerForm({fields, id}));
  });

  const fieldNames = useSelector((state) => selectFieldNames(state, id));

  const regField = ({field}) => {
    dispatch(registerField({field, formId: id}));
  };

  return {
    registerField: regField,
    fieldNames,
    getValues: () => ({})
  }
};

export default useForm;
