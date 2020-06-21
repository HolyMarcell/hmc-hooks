import {SortMapper} from "../http/types";

export const defaultSortMapper: SortMapper = {
  strategy: 'two-field', // Only accepted mode for now
  field: 'sortField',
  direction: 'direction',
  asc: 'ASC',
  desc: 'DESC'
};
