export interface UseFieldApi {
    onChange: any;
    value: any;
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
declare const useField: ({ formId, name }: UseFieldProps) => UseFieldApi;
export default useField;
