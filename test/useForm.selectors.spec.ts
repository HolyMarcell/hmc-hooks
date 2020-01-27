import {config} from "../src/config";
import {
  selectAggregateValues, selectField,
  selectFieldNames,
  selectFields,
  selectForm,
  selectFormState
} from "../src/form/formSelectors";
import {keys, path, prop} from "../src/util/ram";


const mockState = {
  foo: {bar: '1'},
  [config.formKey]: {
    form1: {
      fields: {
        email: {name: 'email', value: 'hallo'},
        'wacken.hacken': {name: 'wacken.hacken', value: 'dreizehn'}
      },
    }
  }
};

const mockValues = {email: 'hallo', wacken: {hacken: 'dreizehn'}};

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

    const ex = keys(path([config.formKey, 'form1', 'fields'], mockState));
    expect(res).toEqual(ex)
  });

  it('selects the aggregated values', () => {
    const res = selectAggregateValues(mockState, 'form1');

    expect(res).toEqual(mockValues)
  });

  it('selects the field', () => {
    const res = selectField(mockState, 'form1', 'email');
    const res2 = selectField(mockState, 'form1', 'wacken.hacken');

    expect(res).toEqual(mockState[config.formKey].form1.fields.email);
    expect(res2).toEqual(mockState[config.formKey].form1.fields['wacken.hacken']);
  });



});

