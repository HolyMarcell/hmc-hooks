import useRequestE from './http/useRequest';
import useDataE from './http/useData';
import {requestReducer as requestReducerE} from "./http/requestDuck";
import defaultPaginationMapperE from './util/defaultPaginationMapper';

export const useRequest = useRequestE;
export const useData = useDataE;
export const requestReducer = requestReducerE;
export const defaultPaginationMapper = defaultPaginationMapperE;
