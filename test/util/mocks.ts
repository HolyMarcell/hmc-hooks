import {Filter, RequestTemplate} from "../../src/http/types";

export const mockTemplate: RequestTemplate = {
  action: {
    url: 'http://example.com',
    method: 'GET'
  },

};


export const mockTemplateCustomPagination = {
  action: {
    url: 'http://paginate-foo.com',
    method: 'GET',
  },
  paginated: true,
  paginationMapper: {
    fromData: {
      elements: 'elements',
      totalElements: 'total.elementsFoo',
      totalPages: 'total.pagesFoo',
      size: 'sizeFoo',
      numberOfElements: 'numberOfElementsFoo',
      nestedSplitChar: '.',
      page: 'indexFoo'
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
  }
};

export const mockTemplateFails = {
  action: {
    url: 'this-fails',
    method: 'GET'
  }
};


export const mockId = 'by-the-great-prophet-zarquon';
export const mockHttpParam = {fnord: 'istdasechoderstille'};
export const mockResponse = {
  elements: [{foo: 'bar'}],
  totalElements: 100,
  totalPages: 10,
  index: 1,
  numberOfElements: 10,
  size: 10
};

export const mockResponseCustomPagination = {
  elements: [{foo: 'bar'}],
  total: {
    elementsFoo: 42,
    pagesFoo:4242
  },
  indexFoo: 4412,
  numberOfElementsFoo: 23,
  sizeFoo: 2323
};


export const mockSortBy = {
  direction: 'asc',
  field: 'zarquon'
};

export const mockFilterBy: Filter = {
  value: 'zaphod',
  field: 'zarquon'
};
