export declare const selectHttp: (state: any) => any;
export declare const selectConst: (_: any, v: any) => any;
export declare const selectData: import("reselect").OutputParametricSelector<any, any, {
    data: any;
    loading: any;
    error: any;
    hasError: any;
} | {
    loading: any;
    error: any;
    hasError: any;
    data: any;
    pagination: {
        totalElements: any;
        totalPages: any;
        index: any;
        size: any;
        numberOfElements: any;
    };
}, (res1: any, res2: any) => {
    data: any;
    loading: any;
    error: any;
    hasError: any;
} | {
    loading: any;
    error: any;
    hasError: any;
    data: any;
    pagination: {
        totalElements: any;
        totalPages: any;
        index: any;
        size: any;
        numberOfElements: any;
    };
}>;
