import {
  FormField,
  RegisterFieldAction, RegisterFieldsAction,
  RegisterFormAction, RemoveFieldAction,
  ResetFieldAction,
  ResetFormAction,
  SetFormValuesAction,
  SetInitialFormValuesAction,
  SubmitFormAction,
  ValidateFieldAction
} from "./types";
import {
  assoc,
  assocPath,
  hasPath,
  is,
  isEmpty,
  isNil,
  keys,
  mergeDeepRight,
  omit,
  path, pathOr,
  prop,
  reject
} from "ramda";
import {
  selectAggregateValues, selectDirtyValues,
  selectField,
  selectFieldNames,
  selectFields,
  selectForm,
  selectFormValid
} from "./formSelectors";

export const REGISTER_FORM = 'form/useForm/registerForm';
export const REMOVE_FIELD = 'form/useForm/removeField';
export const UNSET_FORM = 'form/useForm/unsetForm';
export const SET_FORM_VALUES = 'form/useForm/setFormValues';
export const SET_INITIAL_FORM_VALUES = 'form/useForm/setFormInitialValues';
export const SUBMIT_FORM = 'form/useForm/submitForm';
export const REGISTER_FIELD = 'form/useForm/registerField';
export const REGISTER_FIELDS = 'form/useForm/registerFields';
export const CHANGE_FIELD_PROP = 'form/useForm/changeFieldProp';
export const SET_ALL_VALUES = 'form/useForm/setAllValues';
export const RESET_FIELD = 'form/useForm/resetField';


export const registerField = ({field, formId}: RegisterFieldAction) => {
  return {
    type: REGISTER_FIELD,
    payload: {field, formId}
  }
};

export const removeField = ({name, formId}: RemoveFieldAction) => {
  return {
    type: REMOVE_FIELD,
    payload: {name, formId}
  }
};

export const registerFields = ({fields, formId}: RegisterFieldsAction) => {
  return {
    type: REGISTER_FIELDS,
    payload: {fields, formId}
  }
};


export const changeFieldProp = ({name, formId, prop, value}) => {
  return (dispatch) => {

    dispatch({
      type: CHANGE_FIELD_PROP,
      payload: {name, formId, prop, value}
    });
    return Promise.resolve();
  }
};

export const registerForm = ({fields, formId}: RegisterFormAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const form = selectForm(state, formId);
    if (isNil(form)) {
      dispatch(
        {
          type: REGISTER_FORM,
          payload: {formId}
        }
      );
      dispatch(registerFields({fields, formId}));
      return Promise.resolve();
    }
  }
};


export const setFormValues = ({formId, values}: SetFormValuesAction) => {

  return (dispatch, getState) => {

    if(is(Function, values)) {
      const curr = selectAggregateValues(getState(), formId);

      return dispatch({
        type: SET_FORM_VALUES,
        payload: {formId, values: (values as any)(curr)}
      });

    } else {
      return dispatch({
        type: SET_FORM_VALUES,
        payload: {formId, values}
      })
    }

  }

};

export const setInitialFormValues = ({formId, values}: SetInitialFormValuesAction) => {
  return (dispatch) => {

    dispatch({
      type: SET_INITIAL_FORM_VALUES,
      payload: {formId, values}
    });


    // fill values of form fields that are NIL
    const merge = (curr) => {
      return {
        ...values,
        ...reject(isNil, curr)
      }
    };

    dispatch(setFormValues({formId,
      values: merge
    }));
  }
};

export const validateField = ({formId, name, value}: ValidateFieldAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const {validator, asyncValidator, valid} = selectField(state, formId, name) as FormField;
    if (!isNil(validator)) {
      const stillValid = validator(value);
      if(stillValid !== valid) {
        dispatch(changeFieldProp({formId, name, prop: 'valid', value: stillValid}))
      }
    }

    if (!isNil(asyncValidator)) {
      return asyncValidator(value)
        .then((stillValid) => {
          if(stillValid !== valid) {
            return dispatch(changeFieldProp({formId, name, prop: 'valid', value: stillValid}));
          }
          return Promise.resolve();
        });
    } else {
      return Promise.resolve();
    }
  }
};


export const submitForm = ({formId, onSubmit}: SubmitFormAction) => {
  return (dispatch, getState) => {
    const state = getState();

    const fields = selectFields(state, formId);

    const validations = keys(fields).map((name) => {
      return dispatch(validateField({formId, name, value: path([name, 'value'], fields)}));
    });

    return Promise.all(validations).then(() => {
      const state = getState();
      const values = selectAggregateValues(state, formId);
      const dirty = selectDirtyValues(state, formId);
      const valid = selectFormValid(state, formId);
      if(!valid) {
        return false;
      }
      dispatch({
        type: SUBMIT_FORM,
        payload: {formId}
      });

      return onSubmit(values, dirty);
    });
  }
};

export const resetField = ({formId, name}: ResetFieldAction) => {
  return {
    type: RESET_FIELD,
    payload: {formId, name}
  }
};

export const resetForm = ({formId}: ResetFormAction) => {
  return (dispatch, getState) => {

    const state = getState();
    const fields = selectFieldNames(state, formId);
    return fields.map((field) => {
      return dispatch(resetField({formId, name: field}));
    })
  }
};





export const formReducer = (state = {}, action) => {

  const {type, payload} = action;

  switch (type) {

    case REGISTER_FORM: {
      const {formId} = payload;
      return assoc(formId, {
        fields: {},
      }, state);
    }

    case UNSET_FORM: {
      const {formId} = payload;
      return assoc(formId, {}, state);
    }

    case SET_FORM_VALUES: {
      const {formId, values} = payload;
      const names = keys(values)
        .filter((name) => hasPath([formId, 'fields', name], state));

      const mergeValues = names.reduce((acc, curr: any) => {
        return {...acc, [curr]: { value: path([curr], values)}}
      }, {});
      if(isEmpty(mergeValues)) {
        return state;
      }

      return mergeDeepRight(state, {[formId]: {fields: mergeValues}});
    }

    case SET_INITIAL_FORM_VALUES: {
      const {formId, values} = payload;
      const names = keys(values)
        .filter((name) => hasPath([formId, 'fields', name], state));

      const mergeValues = names.reduce((acc, curr: any) => {
        return {...acc, [curr]: {initialValue: path([curr], values)}}
      }, {});

      return mergeDeepRight(state, {[formId]: {fields: mergeValues}});
    }


    case SUBMIT_FORM: {
      const {formId} = payload;
      return state;
    }

    case REGISTER_FIELD: {
      const {formId, field} = payload;
      const name = prop('name', field);

      const defaultedField = {
        touched: false,
        valid: null,
        ...field
      };

      const fields = {...pathOr({}, [formId, 'fields'], state), [name]: defaultedField};
      return assocPath([formId, 'fields'], fields, state);
    }


    case REMOVE_FIELD: {
      const {formId, name} = payload;


      const fields = omit([name], path([formId, 'fields'], state));
      return assocPath([formId, 'fields'], fields, state);
    }

    case REGISTER_FIELDS: {
      const {formId, fields} = payload;

      const defaulted = fields.reduce((acc, field) => {
        const name = prop('name', field);
        if(hasPath([formId, 'fields', name], state)) {
          return acc;
        }
        return {
          ...acc,
          [name]: {
            touched: false,
            valid: null,
            ...field
          }
        };
      }, {});

      const merge = {...pathOr({}, [formId, 'fields'], state), ...defaulted};
      return assocPath([formId, 'fields'], merge, state);
    }

    case RESET_FIELD: {
      const {formId, name} = payload;
      const initialValue = path([formId, 'fields', name, 'initialValue'], state);

      return assocPath([formId, 'fields', name, 'value'], initialValue, state);
    }

    case CHANGE_FIELD_PROP: {
      const {formId, name, prop, value} = payload;
      return assocPath([formId, 'fields', name, prop], value, state);
    }


    case SET_ALL_VALUES: {
      const {formId, values} = payload;
      return assocPath([formId, 'allValues'], values, state);
    }

    default: {
      return state;
    }
  }

};
