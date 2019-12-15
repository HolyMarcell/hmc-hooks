

export interface PaginationMapper {
  [_]: any;
}

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
  id?: string;
  template: RequestTemplate;
}

export interface UseRequestApi {
  go: () => Promise<any>;
  id: string;
}

export interface RegisterRequestAction {
  action: RequestAction;
  paginated?: boolean;
  paginationMapper?: PaginationMapper;
  id: string;
}
