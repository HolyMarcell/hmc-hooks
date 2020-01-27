export declare const useRequest: ({ id, template }: import("./types").UseRequestProps) => import("./types").UseRequestApi;
export declare const useData: ({ id }: import("./types").UseDataProps) => any;
export declare const requestReducer: (state: {}, action: any) => any;
export declare const defaultPaginationMapper: import("./types").PaginationMapper;
export declare const useForm: ({ fields, id, onSubmit }: import("./form/types").UseFormProps) => import("./form/types").UseFormApi;
export declare const useField: ({ formId, name }: import("./form/useField").UseFieldProps) => import("./form/useField").UseFieldApi;
export declare const formReducer: (state: {}, action: any) => any;
