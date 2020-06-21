// entities

export type FieldType = 'string' | 'number' | string;
export type SubmitFunction = (values: any, dirty: any) => any;
export type ValidatorFn = (value: any) => boolean;
export type AsyncValidatorFn = (value: any) => Promise<boolean>;

export interface FormField  {
  name: string;
  type: FieldType;
  dirty?: boolean;
  touched?: boolean;
  valid?: boolean;
  initialValue?: any;
  validator?: ValidatorFn;
  asyncValidator?: AsyncValidatorFn;
}



export interface UseFormApi {
  registerField: ({field}: {field: FormField}) => void;
  registerFields: ({fields}: {fields: FormField[]}) => void;
  submit: () => any;
  selectedData?: any;
  setValues: (values: Record<string, any>) => any;
  reset: () => void;
  valid: boolean;
}

export interface UseFormProps {
  fields: FormField[];
  id: string;
  onSubmit: SubmitFunction;
  selectData?: (state: Record<any, any>, formId: string) => any;
  initialValues?: Record<string, any>;
}


// Actions


export interface RegisterFormAction {
  formId: string;
  fields: FormField[];
}

export interface RegisterFieldAction {
  formId: string;
  field: FormField;
}

export interface RemoveFieldAction {
  formId: string;
  name: string;
}


export interface RegisterFieldsAction {
  formId: string;
  fields: FormField[];
}

export interface SubmitFormAction {
  formId: string;
  onSubmit: SubmitFunction;
}

export interface ResetFieldAction {
  formId: string;
  name: string;
}

export interface ValidateFieldAction {
  formId: string;
  name: string;
  value: any;
}

export interface ResetFormAction {
  formId: string;
}


export type ModifyFormValuesFn = (currentValues: any) => Record<string, any>;
export interface SetFormValuesAction {
  formId: string;
  values: Record<string, any> | ModifyFormValuesFn;
}

export interface SetInitialFormValuesAction {
  formId: string;
  values: Record<string, any>;
}


// use Field

export interface UseFieldApi {
  onChange: any;
  removeField: () => any;
  value: any;
  reset: () => any;
  name: any;
  formId: string;
  valid: boolean;
  touched: boolean;
  dirty: boolean;
}

export interface UseFieldProps {
  formId: string;
  name: string;
}
