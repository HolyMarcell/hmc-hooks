import {config} from "../src/config";
import {selectAllValues, selectFieldNames, selectFields, selectForm, selectFormState} from "../src/form/formSelectors";
import {path, prop} from "../src/util/ram";


const mockState = {
  foo: {bar: '1'},
  [config.formKey]: {
    form1: {
      fields: [
        {name: 'email', value: 'hallo'},
        {name: 'wacken.hacken', value: 'dreizehn'}
      ],
      allValues: {email: 'hallo', wacken: {hacken: 'dreizehn'}}
    }
  }
};

describe('useForm hook selectors', () => {

  it('selects form state', () => {
    const res = selectFormState(mockState);

    const ex = prop(config.formKey, mockState);
    expect(res).toEqual(ex)
  });


  it('selects the form', () => {
    const res = selectForm(mockState, 'form1');

    const ex = path([config.formKey, 'form1'], mockState);
    expect(res).toEqual(ex)
  });



  it('selects the fields', () => {
    const res = selectFields(mockState, 'form1');

    const ex = path([config.formKey, 'form1', 'fields'], mockState);
    expect(res).toEqual(ex)
  });

  it('selects the field names', () => {
    const res = selectFieldNames(mockState, 'form1');

    const ex = path([config.formKey, 'form1', 'fields'], mockState).map(f => f.name);
    expect(res).toEqual(ex)
  });

  it('selects the form values', () => {
    const res = selectAllValues(mockState, 'form1');

    expect(res).toEqual(mockState[config.formKey].form1.allValues)
  });


});

