import {PrepareFormValuesAction, RegisterFieldAction, RegisterFormAction} from "./types";
import {assoc, assocPath, isNil, path} from "../util/ram";
import {selectAllFieldValues, selectForm} from "./formSelectors";

export const REGISTER_FORM = 'form/useForm/registerForm';
export const REGISTER_FIELD = 'form/useForm/registerField';
export const SET_ALL_VALUES = 'form/useForm/setAllValues';


export const registerField = ({field, formId}: RegisterFieldAction) => {

  return {
    type: REGISTER_FIELD,
    payload: {field, formId}
  }

};

export const registerForm = ({fields, id}: RegisterFormAction) => {
  return (dispatch, getState) => {
    const state = getState();
    const form = selectForm(state, id);
    if (isNil(form)) {
      dispatch(
        {
          type: REGISTER_FORM,
          payload: {id}
        }
      );
      fields.map((field) => {
        dispatch(registerField({field, formId: id}));
      })

    }
  }
};

export const prepareFormValues = ({formId}: PrepareFormValuesAction) => {
  return (dispatch, getState) => {

    const state = getState();
    const values = selectAllFieldValues(state, formId);
    dispatch({
      type: SET_ALL_VALUES,
      payload: {formId, values}
    });
  }
};




export const formReducer = (state = {}, action) => {

  const {type, payload} = action;

  switch (type) {

    case REGISTER_FORM: {
      const {id} = payload;
      return assoc(id, {
        allValues: {},
        fields: [],
      }, state);
    }

    case REGISTER_FIELD: {
      const {formId, field} = payload;
      const fields = path([formId, 'fields'], state).concat(field);
      return assocPath([formId, 'fields'], fields, state);
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
