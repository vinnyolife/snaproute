// withSegment — integrate segment manager with a snaproute router

import { createSegmentManager } from './segment.js';

export function withSegment(router) {
  const seg = createSegmentManager();

  function addRoute(pattern, handler, options = {}) {
    return router.addRoute(pattern, handler, options);
  }

  function resolve(path) {
    const result = router.resolve(path);
    if (result) {
      result.segments = seg.getAll(path);
      result.segmentResults = seg.run(path);
    }
    return result;
  }

  function navigate(path, options) {
    return router.navigate(path, options);
  }

  function registerSegmentHandler(index, handler) {
    seg.register(index, handler);
  }

  function unregisterSegmentHandler(index) {
    seg.unregister(index);
  }

  function getSegment(path, index) {
    return seg.get(path, index);
  }

  function matchesSegment(path, index, value) {
    return seg.matches(path, index, value);
  }

  function segmentCount(path) {
    return seg.count(path);
  }

  return {
    ...router,
    addRoute,
    resolve,
    navigate,
    registerSegmentHandler,
    unregisterSegmentHandler,
    getSegment,
    matchesSegment,
    segmentCount,
  };
}
