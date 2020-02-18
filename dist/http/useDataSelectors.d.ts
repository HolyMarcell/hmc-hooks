import { RequestDataSelection } from "./types";
export declare const selectState: (state: any) => any;
export declare const selectHttp: (state: any) => any;
export declare const secondArg: (_: any, v: any) => any;
export declare const selectRequest: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectNotAction: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectData: import("re-reselect").ParametricSelector<any, any, RequestDataSelection> & {
    resultFunc: (res1: any, res2: any) => RequestDataSelection;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, RequestDataSelection, (res1: any, res2: any) => RequestDataSelection, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectMultiDataObject: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectMultiData: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectAction: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectPaginationMapper: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectSortMapper: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectFilter: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
export declare const selectIsPaginated: import("re-reselect").ParametricSelector<any, any, any> & {
    resultFunc: (res1: any, res2: any) => any;
    dependencies: [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>];
    recomputations: () => number;
    resetRecomputations: () => number;
} & {
    getMatchingSelector: (state: any, props: any, ...args: any[]) => import("re-reselect").OutputParametricSelector<any, any, any, (res1: any, res2: any) => any, [import("re-reselect").ParametricSelector<any, any, any>, import("re-reselect").ParametricSelector<any, any, any>]>;
    removeMatchingSelector: (state: any, props: any, ...args: any[]) => void;
    clearCache: () => void;
    cache: import("re-reselect").ICacheObject;
    keySelector: import("re-reselect").ParametricKeySelector<any, any>;
};
