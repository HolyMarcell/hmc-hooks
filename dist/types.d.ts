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

interface Pagination {
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  page: number;
}

interface PaginationModifier {
  onNext: Function;
  onPref: Function;
  onPageSelect: Function;
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
  pagination?: Pagination & PaginationModifier;
  loading: boolean;
  error: Record<string, any>;
  hasError: boolean;
}


interface UseRequestApi extends RequestDataSelection {
  go: GoFunc;
  reload: () => any;
  id: RequestId;
  setParams: (params: Record<string, any>) => ChainedSetter;
  setSegments: (segments: Record<string, any>) => ChainedSetter;
  setHeaders: (headers: Record<string, any>) => ChainedSetter;
  setData: (data: Record<string, any>) => ChainedSetter;
  setFilter: (filter: Filter) => ChainedSetter;
  setSort: (sort: Sort) => ChainedSetter;
}

interface RegisterRequestAction {
  action: RequestAction;
  paginated?: boolean;
  paginationMapper?: PaginationMapper;
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
  [_]: string;
}

interface SetFilterAction {
  filter: Filter;
  id: RequestId;
}


interface Sort {
  [_]: string;
}

interface SetSortAction {
  sort: Sort;
  id: RequestId;
}

interface SetPageAction {
  mod: (page?: number) => number;
  id: RequestId;
}

export { ChainedSetter, ChangeRequestAction, Filter, GoFunc, Pagination, PaginationMapper, PaginationMapperElements, PaginationModifier, RegisterRequestAction, RequestAction, RequestDataSelection, RequestId, RequestTemplate, SendRequestAction, SetFilterAction, SetPageAction, SetSortAction, Sort, UseDataProps, UseRequestApi, UseRequestProps };
