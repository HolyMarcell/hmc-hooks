import {isEmpty, isNil} from "../util/ram";


export const validators = {
  isRequired: (v) => {
    return !isNil(v) && !isEmpty(v);
  }
};
