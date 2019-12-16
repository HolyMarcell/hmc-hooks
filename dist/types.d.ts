interface PaginationMapper {
  [_]: any;
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
  go: () => Promise<any>;
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

export { ChangeRequestAction, PaginationMapper, RegisterRequestAction, RequestAction, RequestId, RequestTemplate, SendRequestAction, UseRequestApi, UseRequestProps };
