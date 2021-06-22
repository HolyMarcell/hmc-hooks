import {isEmpty, isNil} from "ramda";


export const validators = {
  isRequired: (v) => {
    return !isNil(v) && !isEmpty(v);
  }
};
