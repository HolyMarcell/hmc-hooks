import {UseFormApi, UseFormProps} from "./types";
import {useEffect} from "react";
import {useDispatch} from 'react-redux';
import {registerField, registerForm, setFormValues, setInitialFormValues, submitForm} from "./formDuck";
import {isEmpty, isNil} from "../util/ram";

export const useForm = ({fields, id: formId, onSubmit, initialValues}: UseFormProps): UseFormApi => {

  if (isNil(formId) || isEmpty(formId)) {
    console.warn('useForm: id may not be null or empty');
    return;
  }

  if (isNil(fields) || isEmpty(fields)) {
    console.warn('useForm: fields may not be null or empty');
    return;
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(registerForm({fields, formId}));
    if(!isNil(initialValues)) {
      dispatch(setInitialFormValues({formId, values: initialValues}));
    }
  }, []);

  const submit = () => {
    return dispatch(submitForm({formId, onSubmit}));
  };

  const setValues = (values) => {
    return dispatch(setFormValues({formId, values}));
  };



  const regField = ({field}) => {
    return dispatch(registerField({field, formId}));
  };


  return {
    registerField: regField,
    submit,
    setValues,
  }
};

export default useForm;