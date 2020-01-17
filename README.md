## @hmc/hooks | HolyMarcell/hmc-hooks

### Peer Dependencies:

* axios
* redux
* axios-redux-middleware


### Setup

* `npm i HolyMarcell/hmc-hooks`

Add `requestReducer` as `httpv3` to your reducer definition like this

```js
import {requestReducer} from '@hmc/hooks';

...

const rootReducer = combineReducers({
  httpv3: requestReducer,
  ...
});

```

### Usage

Simple:

```js
import {useRequest} from '@hmc/hooks';

export const SomeComponent = () => { 
  const template = {
  action: {
  url: 'https://foo.bar/baz',
  method: 'GET'  
}
  }
  const {go, loading, data} = useRequest({template});
  go(); // Does not need to be run inside "useEffect", go() will only ever run once (or after changes to the request settings)


  return (
  <div>
  {loading &&
  <p>Loading...</p>
    }
    {!loading &&
    <p>Hello: {data.name}</p>
    }
</div> 
)

}

```

Complex Example:

```js

export const ComplexComponent = ({externalId}) => {
  
  const customPaginationMapper = {
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
  
  const customSortMapper: SortMapper = {
     strategy: 'two-field', // Only accepted mode for now
     field: 'sortField',
     direction: 'direction',
     asc: 'ASC',
     desc: 'DESC'
   };
  
  const template = {
    action: {
      url: 'https://foo.bar/baz/{replaced_segment}',
      method: 'GET',
      segments: {'replaced_segment': externalId},
      params: {search: 'whatever'},
    },
    paginated: true,
    paginationMapper: customPaginationMapper, // is actually a copy of the defaultPaginationMapper
    sortMapper: customSortMapper, // is actually a copy of the defaultSortMapper
  };
  
  const {go, loading, error, hasError, data, 
    setData, filter, setHeaders, setParams, setSegments, sort, reload, 
    id, pagination} = useRequest({template, id: 'set-custom-id'});

  const {setFilter, ...filters} = filter;
  // filters == {query: 'hello', isActive: 'true'} (for example)
  
  const {setSort, direction, field} = sort;
  // try: setSort({field: 'name', direction: 'asc'});
  // -> direction == 'asc' && field == 'name'
  // -> requestedURL == '...?sortField=name&direction=ASC via the mapper above  


  const {onNext, onPrev, onPageSelect, ...paginationData} = pagination;
  // where paginationData has the same shape as the paginationMapper properties e.g. {totalElements, page, ...}

  


  useEffect(() => {
    setData({foo: 'bar'}); // does nothing on GET request xD
    setParams({foo: 1});
    setHeaders({auth: 'password'});
    setSegments({'replaced_segment': 'somethingelse'});
    
    
    setFilter({filterField: 'filter by this value'}); // TBA, not yet doing anything useful
    setSort({}); // TBA, not yet doing anything useful
    
    
    go();
  }, [externalId])
  
  useEffect(() => {
    reload();
  });
  
  return (
    <div>
      {hasError && <DisplayErrorMessage {...error} />}
      
      Request with ID: {id} 
      {loading ? 'is running' : 'has run'}
      
      <DataDisplay data={data} />
      
      <SomePaginationComponent {...pagination} />
    
    </div>
  );
}
```


### Caveats:

* Array to GET-param conversion:

Change the config of your local Axios client to use QS (or whatever you want) to:

```js

config.paramsSerializer = p => {
  return qs.stringify(p, {arrayFormat: 'comma'})
}
```
See also: 'arrayFormat' in QS https://www.npmjs.com/package/qs


### Development:

Use with `npm link`

For webpack projects linking the current dev version of this
add the following to your webpack config:

This will fix the: Invariant Violation: "could not find react-redux context value; please ensure the component is wrapped in a Provider" error.

```js
alias: {
    'react-native': 'react-native-web',
    'react-dom': '@hot-loader/react-dom',
    react: path.resolve('./node_modules/react'),
    'redux': path.resolve('./node_modules/redux'),
    'react-redux': path.resolve('./node_modules/react-redux'),
},
```
