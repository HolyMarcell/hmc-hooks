// entities

export type FieldType = 'string' | 'number' | string;


export interface FormField {
  name: string;
  type: FieldType;
  [_]: any;

}



export interface UseFormApi {
  registerField: ({field}: {field: FormField}) => void;
  getValues: () => Record<string, any>;
  fieldNames: string[];
}

export interface UseFormProps {
  fields: FormField[];
  id: string;
}


// Actions


export interface RegisterFormAction {
  id: string;
  fields: FormField[];
}

export interface RegisterFieldAction {
  formId: string;
  field: FormField;
}

export interface PrepareFormValuesAction {
  formId: string;
}
