import {useForm} from "../src";
import {Provider} from 'react-redux';
import {renderHook} from "@testing-library/react-hooks";
import mockStore from "./util/mockStore";
import {mockId} from "./util/mocks";
import {config} from "../src/config";
import {REGISTER_FIELD, REGISTER_FORM} from "../src/form/formDuck";


const mockFormFields = [
  {name: 'email', type: 'text'},
  {name: 'wacken.hacken', type: 'number'}
];

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
    runHook({fields: mockFormFields, id: mockId});

    const newForm = {
      allValues: {},
      fields: mockFormFields
    };

    const actions = getActions(REGISTER_FORM);

    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual(REGISTER_FORM);

    const state = mockStore.getState();
    expect(state[config.formKey][mockId]).toBeDefined();
    expect(state[config.formKey][mockId]).toEqual(newForm);

    expect(state[config.formKey][mockId].fields).toEqual(mockFormFields)
  });


});

