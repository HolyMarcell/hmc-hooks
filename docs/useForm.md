## useForm hook

and `useField`

### Peer Dependencies:

* redux


### Setup

* `npm i HolyMarcell/hmc-hooks`

Add `formReducer` as `formv3` to your reducer definition like this

```js
import {formReducer} from '@hmc/hooks';

...

const rootReducer = combineReducers({
  formv3: formReducer,
  ...
});

```

### Usage

Simple:

```js
import {useForm} from '@hmc/hooks';

export const SomeComponent = () => { 
  
  const fields: [
    {name: 'email', type: 'text'}
  ]
  
  const onSubmit = (values, dirty) => {console.log(values, dirty)}


  const {submit} = useForm({id: 'foo', fields, onSubmit});
  
  const {onChange, value} = useField({formId: 'foo', name: 'email'});

  return (
    <div>
    
      <input type="text" name={'email'} value={value} onChange={e => onChange(e.target.value)}/>
      <button onClick={() => submit()}>log form values</button>
    </div>
  )
</div> 
)

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
