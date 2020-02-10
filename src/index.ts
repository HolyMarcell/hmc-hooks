import useRequestE from './http/useRequest';
import useDataE from './http/useData';
import {requestReducer as requestReducerE} from "./http/requestDuck";
import defaultPaginationMapperE from './util/defaultPaginationMapper';


import useFormE from './form/useForm';
import useFieldE from './form/useField';
import {formReducer as formReducerE} from './form/formDuck';
import validatorsE from './form/validators';

export const useRequest = useRequestE;
export const useData = useDataE;
export const requestReducer = requestReducerE;
export const defaultPaginationMapper = defaultPaginationMapperE;



export const useForm = useFormE;
export const useField = useFieldE;
export const formReducer = formReducerE;
export const validators = validatorsE;
