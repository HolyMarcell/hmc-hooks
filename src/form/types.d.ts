// entities

export type FieldType = 'string' | 'number' | string;
export type SubmitFunction = (values: any) => any;

export interface FormField {
  name: string;
  type: FieldType;
  dirty?: boolean;
  touched?: boolean;
  valid?: boolean;
  initialValue?: any;
  [_]: any;

}



export interface UseFormApi {
  registerField: ({field}: {field: FormField}) => void;
  submit: () => any;
  setValues: (values: Record<string, any>) => any;
  reset: () => void;
}

export interface UseFormProps {
  fields: FormField[];
  id: string;
  onSubmit: SubmitFunction;
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

export interface SubmitFormAction {
  formId: string;
  onSubmit: SubmitFunction;
}

export interface ResetFieldAction {
  formId: string;
  name: string;
}

export interface ResetFormAction {
  formId: string;
}

export interface SetFormValuesAction {
  formId: string;
  values: Record<string, any>;
}

export interface SetInitialFormValuesAction {
  formId: string;
  values: Record<string, any>;
}


// use Field

export interface UseFieldApi {
  onChange: any;
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
  validator?: (value: any) => boolean;
  asyncValidator?: (value: any) => Promise<boolean>;
}
