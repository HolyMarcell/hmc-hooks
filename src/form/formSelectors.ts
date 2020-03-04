import {config} from "../config";
import {equals, isNil, keys, path, pathOr, prop, propOr} from "../util/ram";
import {createSelectorCreator, defaultMemoize} from "reselect";
import createCachedSelector from 're-reselect';


const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
);


export const selectFormState = state => prop(config.formKey, state);
export const secondArg = (_, v) => v;
export const thirdArg = (_, __, v) => v;

const storeIdAsCacheKey = (_, id) => id;
const storeIdAndFieldNameAsCacheKey = (_, id, name) => `${id}++${name}`;

export const selectForm = createCachedSelector(
  selectFormState,
  secondArg,
  (state, id) => prop(id, state)
)(storeIdAsCacheKey);

export const selectFields = createCachedSelector(
  selectForm,
  secondArg,
  (form, id) => propOr({}, 'fields', form)
)(storeIdAsCacheKey);

export const selectFieldNames = createCachedSelector(
  selectFields,
  secondArg,
  (fields, id) => keys(fields)
)(storeIdAsCacheKey);

export const selectAggregateValues = createCachedSelector(
  selectFields,
  secondArg,
  (fields, id) => {
    return keys(fields).reduce((acc, curr) => {
      return {...acc, [curr]: path([curr, 'value'], fields)};
    }, {})
  }
)(storeIdAsCacheKey);

export const selectDirtyValues = createCachedSelector(
  selectFields,
  secondArg,
  (fields, id) => {
    return keys(fields).reduce((acc, curr) => {
      const dirty = !equals(path([curr, 'value'], fields), path([curr, 'initialValue'], fields));

      if(dirty) {
        return {...acc, [curr]: path([curr, 'value'], fields)};
      }
      return acc;
    }, {})
  }
)(storeIdAsCacheKey);

export const selectFormValid = createCachedSelector(
  selectFields,
  secondArg,
  (fields, id) => {
    return keys(fields).reduce((acc, field) => {
      const valid = prop('valid', fields[field]);
      return acc && isNil(valid) ? true : valid;
    }, true);
  }
)(storeIdAsCacheKey);

export const selectField = createCachedSelector(
  selectFormState,
  secondArg,
  thirdArg,
  (state, formId, name) => {
    const dirty = !equals(path([formId, 'fields', name, 'value'], state),
      path([formId, 'fields', name, 'value'], state));

    return {
      ...path([formId, 'fields', name], state),
      dirty,
    }
  }
)(storeIdAndFieldNameAsCacheKey);
