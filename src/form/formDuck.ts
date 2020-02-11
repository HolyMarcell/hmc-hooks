import {
  RegisterFieldAction,
  RegisterFormAction,
  ResetFieldAction,
  ResetFormAction,
  SetFormValuesAction,
  SetInitialFormValuesAction,
  SubmitFormAction, ValidateFieldAction
} from "./types";
import {assoc, assocPath, hasPath, isEmpty, isNil, keys, merge, mergeDeepRight, path, prop} from "../util/ram";
import {
  selectAggregateValues,
  selectField,
  selectFieldNames,
  selectFields,
  selectForm,
  selectFormValid
} from "./formSelectors";

export const REGISTER_FORM = 'form/useForm/registerForm';
export const UNSET_FORM = 'form/useForm/unsetForm';
export const SET_FORM_VALUES = 'form/useForm/setFormValues';
export const SET_INITIAL_FORM_VALUES = 'form/useForm/setFormInitialValues';
export const SUBMIT_FORM = 'form/useForm/submitForm';
export const REGISTER_FIELD = 'form/useForm/registerField';
export const CHANGE_FIELD_PROP = 'form/useForm/changeFieldProp';
export const SET_ALL_VALUES = 'form/useForm/setAllValues';
export const RESET_FIELD = 'form/useForm/resetField';


export const registerField = ({field, formId}: RegisterFieldAction) => {
  return {
    type: REGISTER_FIELD,
    payload: {field, formId}
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
      fields.map((field) => {
        dispatch(registerField({field, formId}));
      });
      return Promise.resolve();
    }
  }
};

export const setFormValues = ({formId, values}: SetFormValuesAction) => {

  return {
    type: SET_FORM_VALUES,
    payload: {formId, values}
  };

};

export const setInitialFormValues = ({formId, values}: SetInitialFormValuesAction) => {
  return (dispatch) => {

    dispatch({
      type: SET_INITIAL_FORM_VALUES,
      payload: {formId, values}
    });

    dispatch({
      type: SET_FORM_VALUES,
      payload: {formId, values}
    });
  }
};

export const validateField = ({formId, name, value}: ValidateFieldAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const {validator, asyncValidator} = selectField(state, formId, name);
    if (!isNil(validator)) {
      dispatch(changeFieldProp({formId, name, prop: 'valid', value: validator(value)}))
    }

    if (!isNil(asyncValidator)) {
      return asyncValidator(value)
        .then((isValid) => {
          return dispatch(changeFieldProp({formId, name, prop: 'valid', value: isValid}));
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
      const valid = selectFormValid(state, formId);
      if(!valid) {
        return false;
      }
      dispatch({
        type: SUBMIT_FORM,
        payload: {formId}
      });

      return onSubmit(values);
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

      const mergeValues = names.reduce((acc, curr) => {
        return {...acc, [curr]: {value: path([curr], values)}}
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

      const mergeValues = names.reduce((acc, curr) => {
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
        dirty: false,
        touched: false,
        valid: null,
        ...field
      };

      const fields = {...path([formId, 'fields'], state), [name]: defaultedField};
      return assocPath([formId, 'fields'], fields, state);
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
