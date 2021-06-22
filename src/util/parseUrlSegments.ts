import {keys, compose, replace, isNil} from 'ramda';


export const parseUrlSegments = (url: string, segments: Record<string, any>) => {
  if(isNil(segments)) {
    return url;
  }
  const segs = keys(segments).map((seg) => replace(`{${seg}}`, segments[seg])) as any[];
  // @ts-ignore
  return compose(...segs)(url);
};

