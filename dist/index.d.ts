export declare const useRequest: ({ id, template }: import("./types").UseRequestProps) => import("./types").UseRequestApi;
export declare const useMultiRequest: (multiProps: import("./types").UseMultiRequestProps) => import("./types").UseMultiRequestApi;
export declare const useData: ({ id }: import("./types").UseDataProps) => any;
export declare const requestReducer: (state: {}, action: any) => any;
export declare const defaultPaginationMapper: import("./types").PaginationMapper;
export declare const useForm: ({ fields, id: formId, onSubmit, initialValues }: import("./form/types").UseFormProps) => import("./form/types").UseFormApi;
export declare const useField: ({ formId, name }: import("./form/types").UseFieldProps) => import("./form/types").UseFieldApi;
export declare const formReducer: (state: {}, action: any) => any;
export declare const validators: {
    isRequired: (v: any) => boolean;
};
