export declare const selectHttp: (state: any) => any;
export declare const selectConst: (_: any, v: any) => any;
export declare const selectRequest: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
export declare const selectPageParam: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
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
export declare const selectAction: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
export declare const selectPaginationMapper: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
