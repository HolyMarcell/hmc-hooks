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
  
  const template = {
    action: {
      url: 'https://foo.bar/baz/{replaced_segment}',
      method: 'GET',
      segments: {'replaced_segment': externalId},
      params: {search: 'whatever'},
      paginated: true
    },
    paginationMapper: customPaginationMapper // is actually the defaultPaginationMapper
  }
  
  const {go, loading, error, hasError, data, 
    setData, setFilter, setHeaders, setParams, setSegments, setSort, reload, 
    id, pagination} = useRequest({template, id: 'set-custom-id'});
  
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
