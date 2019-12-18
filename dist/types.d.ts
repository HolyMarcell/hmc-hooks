interface PaginationMapper {
  elements: string;
  totalElements: string;
  totalPages: string;
  index: string;
  size: string;
  numberOfElements: string;
  nestedSplitChar: string;
}

type RequestId = string;

interface RequestAction {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' |'OPTIONS' | 'HEAD' | 'CONNECT' | string;
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

interface UseRequestApi {
  go: (force?: boolean) => Promise<any>;
  id: RequestId;
  setParams: (params: Record<string, any>) => void;
  setSegments: (segments: Record<string, any>) => void;
  setHeaders: (headers: Record<string, any>) => void;
  setData: (data: Record<string, any>) => void;
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

export { ChangeRequestAction, Filter, PaginationMapper, RegisterRequestAction, RequestAction, RequestId, RequestTemplate, SendRequestAction, SetFilterAction, UseDataProps, UseRequestApi, UseRequestProps };
