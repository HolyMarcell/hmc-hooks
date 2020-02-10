import {useForm} from "../src";
import {Provider} from 'react-redux';
import {renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {mockId} from "./util/mocks";
import {config} from "../src/config";
import {REGISTER_FORM} from "../src/form/formDuck";


const mockFormFields = [
  {name: 'email', type: 'text'},
  {name: 'wacken.hacken', type: 'number'}
];

const mockSubmit = (values) => values;

describe('useForm hook register', () => {

  beforeEach(() => {
    mockStore.reset();
  });

  const runHook = (props) => {
    const wrapper = ({children}) => Provider({store: mockStore, children});
    const {result} = renderHook(() => useForm(props), {wrapper});
    return result.current;
  };

  const getActions = (type) => {
    const actions = mockStore.getActions();
    return actions.filter((ac) => ac.type === type);
  };


  it('dispatches the register action once', () => {
    runHook({fields: mockFormFields, id: mockId, onSubmit: mockSubmit});

    const newFormShape = {
      fields: expect.any(Object)
    };

    const actions = getActions(REGISTER_FORM);

    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual(REGISTER_FORM);

    const state = mockStore.getState();
    expect(state[config.formKey][mockId]).toBeDefined();
    expect(state[config.formKey][mockId]).toEqual(expect.objectContaining(newFormShape));

  });

  it('aggregates values and passes to onSubmit', async () => {
    const form = runHook({fields: mockFormFields, id: mockId, onSubmit: mockSubmit});

    expect(form.submit).toBeDefined();

    const vals = await form.submit();
    expect(vals).toEqual({email: undefined, 'wacken.hacken': undefined});

  });

  it('inserts initial values correctly', () => {

    const initialValues = {
      email: 'dream evil',
      'wacken.hacken': 'avantasia',
      something: 'else'
    };

    runHook({fields: mockFormFields, id: mockId, onSubmit: mockSubmit, initialValues});

    const state = mockStore.getState();


    expect(state[config.formKey][mockId]).toBeDefined();
    expect(state[config.formKey][mockId].fields.email.initialValue).toEqual(initialValues.email);
    expect(state[config.formKey][mockId].fields.email.value).toEqual(initialValues.email);
    expect(state[config.formKey][mockId].fields['wacken.hacken'].initialValue).toEqual(initialValues['wacken.hacken']);
    expect(state[config.formKey][mockId].fields['wacken.hacken'].value).toEqual(initialValues['wacken.hacken']);

  })


});

