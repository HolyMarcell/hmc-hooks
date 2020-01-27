import {
  RegisterFieldAction,
  RegisterFormAction, ResetFieldAction,
  SetFormValuesAction,
  SetInitialFormValuesAction,
  SubmitFormAction
} from "./types";
import {assoc, assocPath, hasPath, isNil, mergeDeepRight, path, prop} from "../util/ram";
import {selectAggregateValues, selectForm} from "./formSelectors";
import objectToFlatKeys from "../util/objectToFlatKeys";

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
      })
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


export const submitForm = ({formId, onSubmit}: SubmitFormAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const values = selectAggregateValues(state, formId);

    dispatch({
      type: SUBMIT_FORM,
      payload: {formId}
    });

    return onSubmit(values);
  }
};

export const resetField = ({formId, name}: ResetFieldAction) => {
  return {
    type: RESET_FIELD,
    payload: {formId, name}
  }
};


export const formReducer = (state = {}, action) => {

  const {type, payload} = action;

  switch (type) {

    case REGISTER_FORM: {
      const {formId} = payload;
      return assoc(formId, {
        allValues: {},
        fields: {},
      }, state);
    }

    case UNSET_FORM: {
      const {formId} = payload;
      return assoc(formId, {}, state);
    }

    case SET_FORM_VALUES: {
      const {formId, values} = payload;
      const names = objectToFlatKeys(values)
        .filter((name) => hasPath([formId, 'fields', name], state));

      const mergeValues = names.reduce((acc, curr) => {
        return {...acc, [curr]: {value: path(curr.split('.'), values)}}
      }, {});

      return mergeDeepRight(state, {[formId]: {fields: mergeValues}});
    }

    case SET_INITIAL_FORM_VALUES: {
      const {formId, values} = payload;
      const names = objectToFlatKeys(values)
        .filter((name) => hasPath([formId, 'fields', name], state));

      const mergeValues = names.reduce((acc, curr) => {
        return {...acc, [curr]: {initialValue: path(curr.split('.'), values)}}
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
