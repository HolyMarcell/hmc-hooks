import {prop} from "ramda";


export const sortMapToParams = (sortMapper, values) => {
  const {strategy, asc, desc, field, direction} = sortMapper;

  if(strategy === 'two-field') {
    const dir = prop('direction', values) === 'asc' ? asc : desc;
    return {
      [field]: prop('field', values),
      [direction]: dir
    }
  } else {
    console.error(`Unrecognized sort-strategy: ${strategy} in @hmc/hooks. Check your registerRequest function and your sortMapper value`);
  }

};
