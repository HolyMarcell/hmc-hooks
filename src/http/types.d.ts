

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

export interface UseRequestApi {
  go: (force?: boolean) => Promise<any>;
  id: RequestId;
  setParams: (params: Record<string, any>) => void;
  setSegments: (segments: Record<string, any>) => void;
  setHeaders: (headers: Record<string, any>) => void;
  setData: (data: Record<string, any>) => void;
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
