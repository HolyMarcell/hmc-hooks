import { ChangeRequestAction, RegisterRequestAction, SendRequestAction, SetFilterAction } from "./types";
export declare const REGISTER_REQUEST = "http/useRequest/registerRequest";
export declare const CHANGE_REQUEST = "http/useRequest/changeRequest";
export declare const SET_FILTER = "http/useRequest/setFiler";
export declare const SEND_REQUEST = "http/useRequest/sendRequest";
export declare const SEND_REQUEST_FAIL = "http/useRequest/sendRequest_FAIL";
export declare const SEND_REQUEST_SUCCESS = "http/useRequest/sendRequest_SUCCESS";
export declare const registerRequest: ({ action, paginated, paginationMapper, id }: RegisterRequestAction) => {
    type: string;
    payload: {
        action: import("./types").RequestAction;
        paginated: boolean;
        paginationMapper: import("./types").PaginationMapper;
        id: string;
    };
};
export declare const changeRequest: ({ id, type, value }: ChangeRequestAction) => {
    type: string;
    payload: {
        id: string;
        type: string;
        value: any;
    };
};
export declare const setFilter: ({ id, filter }: SetFilterAction) => (dispatch: any) => any;
export declare const sendRequest: ({ id }: SendRequestAction) => (dispatch: any, getState: any) => any;
export declare const requestReducer: (state: {}, action: any) => any;
