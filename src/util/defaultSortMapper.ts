import {SortMapper} from "../http/types";

const defaultSortMapper: SortMapper = {
  strategy: 'two-field', // Only accepted mode for now
  field: 'sortField',
  direction: 'direction',
  asc: 'ASC',
  desc: 'DESC'
};

export default defaultSortMapper;