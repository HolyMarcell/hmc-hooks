import {useField, useForm} from "../src";
import {Provider} from 'react-redux';
import {act, renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {mockId} from "./util/mocks";
import objectContaining = jasmine.objectContaining;
import * as React from "react";
import {CHANGE_FIELD_PROP} from "../src/form/formDuck";


const mockFormFields = [
  {name: 'email', type: 'text'},
  {name: 'wacken.hacken', type: 'number'}
];

const mockSubmit = (values) => values;

describe('useField hook', () => {

  beforeEach(() => {
    mockStore.reset();
  });

  const runFormHook = (props) => {
    const wrapper = ({children}) => Provider({store: mockStore, children});
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


  it('returns the form field', () => {
    runFormHook({fields: mockFormFields, id: mockId, onSubmit: mockSubmit});

    const {field} = runFieldHook({formId: mockId, name: 'email'});
    const {field: field2} = runFieldHook({formId: mockId, name: 'wacken.hacken'});

    const fieldShape = {
      onChange: expect.any(Function),
      name: expect.any(String),
      formId: expect.any(String),
      touched: expect.any(Boolean),
      dirty: expect.any(Boolean),
    };

    expect(field).toEqual(objectContaining(fieldShape));
    expect(field.formId).toEqual(mockId);
    expect(field.name).toEqual('email');


    expect(field2).toEqual(objectContaining(fieldShape));
    expect(field2.formId).toEqual(mockId);
    expect(field2.name).toEqual('wacken.hacken');

  });

  it('changes the value', async () => {
    runFormHook({fields: mockFormFields, id: mockId, onSubmit: mockSubmit});

    const {field} = runFieldHook({formId: mockId, name: 'email'});
    const {field: field2} = runFieldHook({formId: mockId, name: 'wacken.hacken'});

    const val = 'prophet@zarquon.galaxy';

    act(() => {
      field.onChange(val);
    });


    const ac = getActions(CHANGE_FIELD_PROP);
    expect(ac).toHaveLength(1);

    expect(mockStore.getState().formv3[mockId].fields.email.value).toEqual(val);


    const val2 = 'döner';
    act(() => {
      field2.onChange(val2);
    });

    const ac2 = getActions(CHANGE_FIELD_PROP);
    expect(ac2).toHaveLength(2);

    expect(mockStore.getState().formv3[mockId].fields['wacken.hacken'].value).toEqual(val2);

  });


  it('Reset field works', async () => {
    runFormHook({fields: mockFormFields, id: mockId, onSubmit: mockSubmit, initialValues: {email: 'foo'}});

    const {field} = runFieldHook({formId: mockId, name: 'email'});
    const {field: field2} = runFieldHook({formId: mockId, name: 'wacken.hacken'});


    act(() => {

      field.onChange('askjhdb');
      field2.onChange('klabuster');

      field.reset();
      field2.reset();
    })


    expect(mockStore.getState().formv3[mockId].fields['email'].value).toEqual('foo');
    expect(mockStore.getState().formv3[mockId].fields['wacken.hacken'].value).toEqual(undefined);

  });


});

