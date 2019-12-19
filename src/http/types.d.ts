

export interface PaginationMapper {
  elements: string;
  totalElements: string;
  totalPages: string;
  index: string;
  size: string;
  numberOfElements: string;
  nestedSplitChar: string;
}

export type RequestId = string;

export interface RequestAction {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' |'OPTIONS' | 'HEAD' | 'CONNECT' | string;
  params?: Record<string, any>;
  data?: Record<string, any>;
  segments?: Record<string, any>;
  headers?: Record<string, any>;
}

export interface RequestTemplate {
  action: RequestAction;
  dependencies?: Array<any>;
  paginated?: boolean;
  paginationMapper?: PaginationMapper;

}

export interface UseRequestProps {
  id?: RequestId;
  template: RequestTemplate;
}


export type GoFunc = (force?: boolean) => Promise<any>;
export interface ChainedSetter {
  go: GoFunc;
}

export interface UseRequestApi {
  go: GoFunc;
  id: RequestId;
  setParams: (params: Record<string, any>) => ChainedSetter;
  setSegments: (segments: Record<string, any>) => ChainedSetter;
  setHeaders: (headers: Record<string, any>) => ChainedSetter;
  setData: (data: Record<string, any>) => ChainedSetter;
  setFilter: (filter: Filter) => ChainedSetter;
  setSort: (sort: Sort) => ChainedSetter;
}

export interface RegisterRequestAction {
  action: RequestAction;
  paginated?: boolean;
  paginationMapper?: PaginationMapper;
  id: RequestId;
}

export interface ChangeRequestAction {
  id: RequestId;
  type: 'params' | 'segments' | 'data' | 'headers' | string;
  value: any;
}

export interface SendRequestAction {
  id: RequestId;
}

export interface UseDataProps {
  id: RequestId;
}

export interface Filter {
  [_]: string;
}

export interface SetFilterAction {
  filter: Filter;
  id: RequestId;
}


export interface Sort {
  [_]: string;
}

export interface SetSortAction {
  sort: Sort;
  id: RequestId;
}

export interface SetPageAction {
  mod: (page?: number) => number;
  id: RequestId;
}
