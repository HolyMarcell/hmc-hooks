import { UseFieldApi, UseFieldProps } from "./types";
declare const useField: ({ formId, name, validator, asyncValidator }: UseFieldProps) => UseFieldApi;
export default useField;
