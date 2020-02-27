
import * as R from 'ramda';


export const assoc = (key: any, value: any, object: any) => R.assoc(key, value, object);
export const path = (...args) => R.path(...args);
export const pathOr = (...args) => R.pathOr(...args);
export const isNil = (...args) => R.isNil(...args);
export const assocPath = (...args) => R.assocPath(...args);
export const dissocPath = (...args) => R.dissocPath(...args);
export const dissoc = (...args) => R.dissoc(...args);
export const prop = (...args) => R.prop(...args);
export const pick = (list: string[], from: any) => R.pick(list, from);
export const merge = (...args) => R.merge(...args);
export const propOr = (...args) => R.propOr(...args);
export const is = <T = any>(t: T, x: any): x is T => R.is(t, x,);
export const last = (...args) => R.last(...args);
export const reject = (...args) => R.reject(...args);
export const has = (...args) => R.has(...args);
export const hasPath = (...args) => R.hasPath(...args);
export const isEmpty = (...args) => R.isEmpty(...args);
export const keys = (...args) => R.keys(...args);
export const mergeDeepRight = (...args) => R.mergeDeepRight(...args);
export const equals = (...args) => R.equals(...args);
export const flatten = (...args) => R.flatten(...args);
export const startsWith = (search: string | any[], collection: string | any[]) => R.startsWith(search, collection);
export const splitAt = (...args) => R.splitAt(...args);
export const contains = (...args) => R.contains(...args);
export const find = (...args) => R.find(...args);
export const propEq = (...args) => R.propEq(...args);
export const intersection = (...args) => R.intersection(...args);
export const filter = (predicate: Function, filterable: any) => R.filter(predicate, filterable);

