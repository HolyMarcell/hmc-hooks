import {set, lensPath} from 'ramda';


/*
  Creates an object _including if neccessary arrays_ from paths

  Usage:

  const res = assocPathArray(['foo', 0, 'bar'], 'wacken', {})
  res === {foo: [{bar: 'wacken}]};

 */

const assocPathArray = (path, value, target) => {

  const pathElements = path.map((ele) => {
    // -- Map Numbers back to number-type
    return isNaN(+ele) ? ele : + ele
  });

  return  set(lensPath(pathElements), value, target);
};

export default assocPathArray;
