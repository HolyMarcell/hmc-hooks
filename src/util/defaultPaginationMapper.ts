import {PaginationMapper} from "../http/types";

export const defaultPaginationMapper: PaginationMapper = {
  fromData: {
    elements: 'elements',
    totalElements: 'totalElements',
    totalPages: 'totalPages',
    size: 'size',
    numberOfElements: 'numberOfElements',
    nestedSplitChar: '.',
    page: 'index'
  },
  toParam: {
    elements: 'elements',
    totalElements: 'totalElements',
    totalPages: 'totalPages',
    size: 'size',
    numberOfElements: 'numberOfElements',
    nestedSplitChar: '.',
    page: 'page'
  }
};

