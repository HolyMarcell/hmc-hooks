import useRequestE from './http/useRequest';
import useDataE from './http/useData';
import {requestReducer as requestReducerE} from "./http/requestDuck";

export const useRequest = useRequestE;
export const useData = useDataE;
export const requestReducer = requestReducerE;
