
import {config} from "../config";
import {equals, path, pathOr, prop, propOr} from "../util/ram";
import {createSelector, createSelectorCreator, defaultMemoize} from "reselect";
import assocPathArray from "../util/assocPathArray";

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
);


export const selectFormState = state => prop(config.formKey, state);
export const selectConst = (_, v) => v;


export const selectForm = createDeepEqualSelector(
  selectFormState,
  selectConst,
  (state, id) => prop(id, state)
);

export const selectFields = createDeepEqualSelector(
  selectForm,
  selectConst,
  (form, id) => propOr([], 'fields', form)
);

export const selectFieldNames = createDeepEqualSelector(
  selectFields,
  selectConst,
  (fields, id) =>  fields.map((f) => prop('name', f))
);

export const selectAllFieldValues = createDeepEqualSelector(
  selectFields,
  selectConst,
  (fields, id) => {
    let res = {};
    for(const field of fields) {
      res = assocPathArray(prop('name', field).split('.'), prop('value', field), res);
    }
    return res;
  }
);

export const selectAllValues = createDeepEqualSelector(
  selectForm,
  selectConst,
  (form, id) => prop('allValues', form)
);
