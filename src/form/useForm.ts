import {UseFormApi, UseFormProps} from "./types";
import {useEffect} from "react";
import {useDispatch} from 'react-redux';
import {
  registerField,
  registerFields,
  registerForm,
  resetForm,
  setFormValues,
  setInitialFormValues,
  submitForm
} from "./formDuck";
import {isEmpty, isNil} from "../util/ram";

export const useForm = ({fields, id: formId, onSubmit, initialValues}: UseFormProps): UseFormApi => {

  if (isNil(fields) || isEmpty(fields)) {
    console.warn('useForm: fields may not be null or empty');
    return;
  }

  const valid = true; // useSelector((state) => selectFormValid(state, formId));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(registerForm({fields, formId}));

    if (!isNil(initialValues)) {
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

  const regFields = ({fields}) => {
    return dispatch(registerFields({fields, formId}));
  };

  const reset = () => {
    dispatch(resetForm({formId}));
  };

  return {
    registerField: regField,
    registerFields: regFields,
    submit,
    valid,
    setValues,
    reset,
  }
};

export default useForm;
