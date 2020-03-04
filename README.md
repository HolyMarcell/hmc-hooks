## @hmc/hooks | HolyMarcell/hmc-hooks

* [useRequest](./docs/useRequest.md)
* [useForm](./docs/useForm.md) (and useField)


### Changelog

useForm:

* field.dirty is now computed value (via the selector)
* form.onSubmit signature changed from (values) => any; to (values, dirty) => any; which allows to 
perform actions only on dirty form values.

useRequest:

* Added "useMultiRequest" hook, that will accept multiple templates as  `{name1: $template1, name2: $template2}`
and return the result of each request if called (`goAll()`). Each request on its own offers the same API as `useRequest`


Both:

* Used "re-reselect" to create cached selectors:

Problem: We may have multiple hooks (of form or request) that are being rendered. In this
case the "memoize one last result" strategy of reselect breaks because any change to one 
of the hooks with "id1" would invalidate all cache in the second hook with "id2".

This results in complete re-renders of both components triggered by useSelector() 
since all createSelector's think something happened that needs to be displayed.

Solution:

Re-Reselect curries a function after the createSelector (now called `createCachedSelector`)
that derives a cache-key from the arguments to the selector. This way the createCachedSelector
can diffrerentiate between state changes that happen to the Hook that is subscribed to it's state
and the hook that is subscribed to "neighboring state". -> No unneccessary rerenders.

TL;DR

`selectData(state, requestId)` in request hook would render way too often if two hooks using it were present.
Now we use `requestId` as cache-key and the problem goes away.


useRequest:

* added setFile({fileField: file}); api
If a file is present all additional JSON "data" will be sent as multipart/formdata formatted request



#### 1.2.0

useForm:

* added `useForm` hook

#### 1.1.0

useRequest:


* 'reloadsOn' property in Templates implemented. Usage: Set `reloadsOn: ['sort']` -> `sort.setSort(...)` reloads the request.
* resetSort functionality added to `{sort} = useRequest(...)` with usage: `sort.resetSort()`
