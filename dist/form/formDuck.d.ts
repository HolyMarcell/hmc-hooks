import { RegisterFieldAction, RegisterFormAction, SubmitFormAction } from "./types";
export declare const REGISTER_FORM = "form/useForm/registerForm";
export declare const UNSET_FORM = "form/useForm/unsetForm";
export declare const SUBMIT_FORM = "form/useForm/submitForm";
export declare const REGISTER_FIELD = "form/useForm/registerField";
export declare const CHANGE_FIELD_VALUE = "form/useForm/changeFieldValue";
export declare const SET_ALL_VALUES = "form/useForm/setAllValues";
export declare const registerField: ({ field, formId }: RegisterFieldAction) => {
    type: string;
    payload: {
        field: import("./types").FormField;
        formId: string;
    };
};
export declare const changeFieldValue: ({ name, formId, value }: {
    name: any;
    formId: any;
    value: any;
}) => {
    type: string;
    payload: {
        name: any;
        formId: any;
        value: any;
    };
};
export declare const registerForm: ({ fields, id }: RegisterFormAction) => (dispatch: any, getState: any) => void;
export declare const submitForm: ({ formId, onSubmit }: SubmitFormAction) => (dispatch: any, getState: any) => any;
export declare const formReducer: (state: {}, action: any) => any;
