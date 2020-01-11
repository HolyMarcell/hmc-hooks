import { RequestDataSelection } from "./types";
export declare const selectHttp: (state: any) => any;
export declare const selectConst: (_: any, v: any) => any;
export declare const selectRequest: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
export declare const selectPageParam: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
export declare const selectNotAction: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
export declare const selectData: import("reselect").OutputParametricSelector<any, any, RequestDataSelection, (res1: any, res2: any) => RequestDataSelection>;
export declare const selectAction: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
export declare const selectPaginationMapper: import("reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any>;
