import { RegisterFieldAction, RegisterFormAction, ResetFieldAction, SetFormValuesAction, SetInitialFormValuesAction, SubmitFormAction } from "./types";
export declare const REGISTER_FORM = "form/useForm/registerForm";
export declare const UNSET_FORM = "form/useForm/unsetForm";
export declare const SET_FORM_VALUES = "form/useForm/setFormValues";
export declare const SET_INITIAL_FORM_VALUES = "form/useForm/setFormInitialValues";
export declare const SUBMIT_FORM = "form/useForm/submitForm";
export declare const REGISTER_FIELD = "form/useForm/registerField";
export declare const CHANGE_FIELD_PROP = "form/useForm/changeFieldProp";
export declare const SET_ALL_VALUES = "form/useForm/setAllValues";
export declare const RESET_FIELD = "form/useForm/resetField";
export declare const registerField: ({ field, formId }: RegisterFieldAction) => {
    type: string;
    payload: {
        field: import("./types").FormField;
        formId: string;
    };
};
export declare const changeFieldProp: ({ name, formId, prop, value }: {
    name: any;
    formId: any;
    prop: any;
    value: any;
}) => (dispatch: any) => Promise<void>;
export declare const registerForm: ({ fields, formId }: RegisterFormAction) => (dispatch: any, getState: any) => void;
export declare const setFormValues: ({ formId, values }: SetFormValuesAction) => {
    type: string;
    payload: {
        formId: string;
        values: Record<string, any>;
    };
};
export declare const setInitialFormValues: ({ formId, values }: SetInitialFormValuesAction) => (dispatch: any) => void;
export declare const submitForm: ({ formId, onSubmit }: SubmitFormAction) => (dispatch: any, getState: any) => any;
export declare const resetField: ({ formId, name }: ResetFieldAction) => {
    type: string;
    payload: {
        formId: string;
        name: string;
    };
};
export declare const formReducer: (state: {}, action: any) => any;
