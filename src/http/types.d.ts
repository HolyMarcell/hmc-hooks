
export interface PaginationMapperElements {
  elements: string;
  totalElements: string;
  totalPages: string;
  size: string;
  page: string;
  numberOfElements: string;
  nestedSplitChar: string;
}

export interface PaginationMapper {
  fromData: PaginationMapperElements;
  toParam: PaginationMapperElements;
}

export interface SortMapper {
  strategy: 'two-field';
  field: string;
  direction: string;
  asc: string;
  desc: string;
}


export interface PaginationModifier {
  onNext: () => {go: () => Promise<any>};
  onPrev: () => {go: () => Promise<any>};
  onPageSelect: (page: number) => {go: () => Promise<any>};
}

export interface Pagination extends PaginationModifier{
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  page: number;
}


export type RequestId = string;

export interface RequestAction {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | string;
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
  sortMapper?: SortMapper;
}

export interface UseRequestProps {
  id?: RequestId;
  template: RequestTemplate;
}


export type GoFunc = (force?: boolean) => Promise<any>;

export interface ChainedSetter {
  go: GoFunc;
}

export interface RequestDataSelection {
  data: Record<string, any> | Array<any> | any;
  pagination?: Pagination;
  loading: boolean;
  error: Record<string, any>;
  hasError: boolean;
  filter?: Record<string, any>;
  sort?: Record<string, any>;
}

export interface RequestApiSortField extends Sort {
  setSort: (sort: Sort) => ChainedSetter;
}

export interface RequestApiFilterField {
  setFilter: (filter: Filter) => ChainedSetter;
  resetFilters: () => ChainedSetter;
  filters?: Record<string, any>;
}


export interface UseRequestApi extends RequestDataSelection {
  go: GoFunc;
  reload: () => any;
  id: RequestId;
  setParams: (params: Record<string, any>) => ChainedSetter;
  setSegments: (segments: Record<string, any>) => ChainedSetter;
  setHeaders: (headers: Record<string, any>) => ChainedSetter;
  setData: (data: Record<string, any>) => ChainedSetter;
  sort: RequestApiSortField;
  filter: RequestApiFilterField;
}

export interface RegisterRequestAction {
  action: RequestAction;
  paginated?: boolean;
  paginationMapper?: PaginationMapper;
  sortMapper?: SortMapper;
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
  value: string;
  field: string;
}

export interface SetFilterAction {
  filter: Filter;
  id: RequestId;
}

export interface ResetFilterAction {
  id: RequestId;
}


export interface Sort {
  field: string;
  direction?: 'asc' | 'desc' | string;
}

export interface SetSortAction {
  sort: Sort;
  id: RequestId;
}

export interface SetPageAction {
  mod: (page?: number) => number;
  id: RequestId;
}

