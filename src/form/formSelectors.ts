import {config} from "../config";
import {equals, keys, path, prop, propOr} from "../util/ram";
import {createSelector, createSelectorCreator, defaultMemoize} from "reselect";
import assocPathArray from "../util/assocPathArray";

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
);


export const selectFormState = state => prop(config.formKey, state);
export const secondArg = (_, v) => v;
export const thirdArg = (_, __, v) => v;


export const selectForm = createSelector(
  selectFormState,
  secondArg,
  (state, id) => prop(id, state)
);

export const selectFields = createSelector(
  selectForm,
  secondArg,
  (form, id) => propOr({}, 'fields', form)
);

export const selectFieldNames = createSelector(
  selectFields,
  secondArg,
  (fields, id) => keys(fields)
);

export const selectAggregateValues = createSelector(
  selectFields,
  secondArg,
  (fields, id) => {
    return keys(fields).reduce((acc, curr) => {
      return assocPathArray(curr.split('.'), path([curr, 'value'], fields), acc);
    }, {})
  }
);



export const selectField = createSelector(
  selectFormState,
  secondArg,
  thirdArg,
  (state, formId, name) =>  path([formId, 'fields', name], state)
);
