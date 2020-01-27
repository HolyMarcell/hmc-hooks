

// -- Returns a list of Strings that denotes all property paths:
/*

{
  foo: {
      bar: 'baz',
      fnord: 1,
      faz: 2,
      forz: {
        fizz: 'buz'
      }
    }
}

=>

[
  "foo.bar",
  "foo.fnord",
  "foo.faz",
  "foo.forz.fizz",
]
 */

import {flatten, is, keys, prop} from './ram';

const objectToFlatKeys = (obj, prefix = '') => {

  const list = keys(obj).map((key) => {
    if(!is(Object, prop(key, obj))) {
      return `${prefix === '' ? '' : `${prefix}.`}${key}`;
    } else {
      return objectToFlatKeys(prop(key, obj), `${prefix === '' ? '' : `${prefix}.`}${key}`);
    }
  });

  return flatten(list);
};

export default objectToFlatKeys;