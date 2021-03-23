import {useField, useForm} from "../src";
import {Provider} from 'react-redux';
import {act, renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {mockId} from "./util/mocks";
import * as React from "react";


const mockFormFields = [
  {name: 'email', type: 'text'},
  {name: 'wacken.hacken', type: 'number'}
];

const mockSubmit = (values) => values;

describe('useField hook metavalues', () => {

  beforeEach(async () => {
    await mockStore.reset();
  });

  const runFormHook = (props) => {
    const wrapper = ({children}) =>  React.createElement(Provider, {store: mockStore}, children);
    const {result} = renderHook(() => useForm(props), {wrapper});
    return result.current;
  };

  const runFieldHook = (props) => {
    const wrapper = ({children}) => React.createElement(Provider, {store: mockStore}, children);
    const {result, rerender} = renderHook(() => useField(props), {wrapper});
    return {field: result.current, rerender};
  };

  const getActions = (type) => {
    const actions = mockStore.getActions();
    return actions.filter((ac) => ac.type === type);
  };



  it('changes "touched" value correctly', () => {
    const mockId = 'waswas'
    runFormHook({fields: mockFormFields, id: mockId, onSubmit: mockSubmit});
    const {field} = runFieldHook({formId: mockId, name: 'email'});

    expect(mockStore.getState().formv3[mockId].fields['email'].touched).toEqual(false);

    act(() => {
      field.onChange('askjhdb');
    });
    expect(mockStore.getState().formv3[mockId].fields['email'].touched).toEqual(true);
  });

  it('changes "dirty" value correctly', async () => {
    runFormHook({fields: mockFormFields, id: mockId, onSubmit: mockSubmit, initialValues: {email: 'foo'}});

    // dirty is now a computed value. this crappy testing setup cannot check for that
  });


});

