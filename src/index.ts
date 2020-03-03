import useRequestE from './http/useRequest';
import useMultiRequestE from './http/useMultiRequest';
import useDataE from './http/useData';
import {requestReducer as requestReducerE} from "./http/requestDuck";
import defaultPaginationMapperE from './util/defaultPaginationMapper';


import useFormE from './form/useForm';
import useFieldE from './form/useField';
import {formReducer as formReducerE} from './form/formDuck';
import validatorsE from './form/validators';
import {selectAggregateValues, selectFields, selectForm, selectFormState} from "./form/formSelectors";

export const useRequest = useRequestE;
export const useMultiRequest = useMultiRequestE;
export const useData = useDataE;
export const requestReducer = requestReducerE;
export const defaultPaginationMapper = defaultPaginationMapperE;



export const useForm = useFormE;
export const useField = useFieldE;
export const formReducer = formReducerE;
export const validators = validatorsE;
export const formSelectors = {
  selectFormState,
  selectForm,
  selectFields,
  selectAggregateValues,
};
