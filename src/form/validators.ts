import {isEmpty, isNil} from "../util/ram";


const validators = {
  isRequired: (v) => {
    return !isNil(v) && !isEmpty(v);
  }
};

export default validators;
