import {useRequest} from "../src";
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import { renderHook } from "@testing-library/react-hooks";
const mockStore = createStore((s) => s);


const mockTemplate = {
  action: {
    url: 'http://example.com',
    method: 'GET'
  }
};
const mockId = 'by-the-great-prophet-zarquon';


describe('useRequest hook', () => {

  fit('exists', () => {
    expect(useRequest).toBeDefined();
    console.log(mockStore.getState)
    const wrapper = ({children}) => Provider({store: mockStore, children});
    const {result} = renderHook(() => useRequest({template: mockTemplate}), {wrapper});
    console.log(result.current)
  });

  it('returns a go function', () => {
    const api = useRequest({template: mockTemplate});

    expect(api).toHaveProperty('go', expect.any(Function));
  });

  it('returns the correct (or random) id', () => {
    const api = useRequest({template: mockTemplate});
    const api2 = useRequest({template: mockTemplate, id: mockId});
    expect(api).toHaveProperty('id', expect.any(String));
    expect(api2).toHaveProperty('id', mockId);
  });

  it('fails on empty template', () => {
    const api = useRequest({} as any);
    expect(api).toBe(undefined);
  });

  it('fails on empty action', () => {
    const api = useRequest({template: {action: {}}} as any);
    expect(api).toBe(undefined);
  });

  it('fails on empty url or method', () => {
    const api = useRequest({template: {action: {url: ''}}} as any);
    const api2 = useRequest({template: {action: {url: 'http://foo.de'}}} as any);
    const api3 = useRequest({template: {action: {method: 'GET'}}} as any);
    expect(api).toBe(undefined);
    expect(api2).toBe(undefined);
    expect(api3).toBe(undefined);
  });


});

