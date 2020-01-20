interface PaginationMapperElements {
  elements: string;
  totalElements: string;
  totalPages: string;
  size: string;
  page: string;
  numberOfElements: string;
  nestedSplitChar: string;
}

interface PaginationMapper {
  fromData: PaginationMapperElements;
  toParam: PaginationMapperElements;
}

interface SortMapper {
  strategy: 'two-field';
  field: string;
  direction: string;
  asc: string;
  desc: string;
}


interface PaginationModifier {
  onNext: () => {go: () => Promise<any>};
  onPrev: () => {go: () => Promise<any>};
  onPageSelect: (page: number) => {go: () => Promise<any>};
}

interface Pagination extends PaginationModifier{
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  page: number;
}


type RequestId = string;

interface RequestAction {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | string;
  params?: Record<string, any>;
  data?: Record<string, any>;
  segments?: Record<string, any>;
  headers?: Record<string, any>;
}

interface RequestTemplate {
  action: RequestAction;
  dependencies?: Array<any>;
  paginated?: boolean;
  paginationMapper?: PaginationMapper;
  sortMapper?: SortMapper;
}

interface UseRequestProps {
  id?: RequestId;
  template: RequestTemplate;
}


type GoFunc = (force?: boolean) => Promise<any>;

interface ChainedSetter {
  go: GoFunc;
}

interface RequestDataSelection {
  data: Record<string, any> | Array<any> | any;
  pagination?: Pagination;
  loading: boolean;
  error: Record<string, any>;
  hasError: boolean;
  filter?: Record<string, any>;
  sort?: Record<string, any>;
}

interface RequestApiSortField extends Sort {
  setSort: (sort: Sort) => ChainedSetter;
}

interface RequestApiFilterField {
  setFilter: (filter: Filter) => ChainedSetter;
  resetFilters: () => ChainedSetter;
  filters?: Record<string, any>;
}


interface UseRequestApi extends RequestDataSelection {
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

interface RegisterRequestAction {
  action: RequestAction;
  paginated?: boolean;
  paginationMapper?: PaginationMapper;
  sortMapper?: SortMapper;
  id: RequestId;
}

interface ChangeRequestAction {
  id: RequestId;
  type: 'params' | 'segments' | 'data' | 'headers' | string;
  value: any;
}

interface SendRequestAction {
  id: RequestId;
}

interface UseDataProps {
  id: RequestId;
}

interface Filter {
  value: string;
  field: string;
}

interface SetFilterAction {
  filter: Filter;
  id: RequestId;
}

interface ResetFilterAction {
  id: RequestId;
}


interface Sort {
  field: string;
  direction?: 'asc' | 'desc' | string;
}

interface SetSortAction {
  sort: Sort;
  id: RequestId;
}

interface SetPageAction {
  mod: (page?: number) => number;
  id: RequestId;
}

export { ChainedSetter, ChangeRequestAction, Filter, GoFunc, Pagination, PaginationMapper, PaginationMapperElements, PaginationModifier, RegisterRequestAction, RequestAction, RequestApiFilterField, RequestApiSortField, RequestDataSelection, RequestId, RequestTemplate, ResetFilterAction, SendRequestAction, SetFilterAction, SetPageAction, SetSortAction, Sort, SortMapper, UseDataProps, UseRequestApi, UseRequestProps };
