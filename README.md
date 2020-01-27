## @hmc/hooks | HolyMarcell/hmc-hooks

* [useRequest](./docs/useRequest.md)
* [useForm](./docs/useForm.md) (and useField)


### Changelog

#### 1.2.0

useForm:

* added `useForm` hook

#### 1.1.0

useRequest:


* 'reloadsOn' property in Templates implemented. Usage: Set `reloadsOn: ['sort']` -> `sort.setSort(...)` reloads the request.
* resetSort functionality added to `{sort} = useRequest(...)` with usage: `sort.resetSort()`
