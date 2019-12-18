import {config} from "../config";
import {path, prop} from "../util/ram";
import {createSelector} from "reselect";

export const selectHttp = state => prop(config.reduxTopLevelKey, state);

export const selectConst = (_, v) => v;

export const selectRequest = createSelector(
  selectHttp,
  selectConst,
  (state, id) => prop(id, state)
);

export const selectRequestData = createSelector(
  selectHttp,
  selectConst,
  (state, id) => path([id, 'data'], state)
);
