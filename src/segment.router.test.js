import { createRouter } from './router.js';
import { withSegment } from './segment.router.js';

function makeRouter() {
  const base = createRouter();
  base.addRoute('/users/:id', ({ params }) => ({ page: 'user', id: params.id }));
  base.addRoute('/posts/:slug/comments', () => ({ page: 'comments' }));
  return withSegment(base);
}

test('resolve enriches result with segments array', () => {
  const router = makeRouter();
  const result = router.resolve('/users/42');
  expect(result).not.toBeNull();
  expect(result.segments).toEqual(['users', '42']);
});

test('resolve includes segmentResults from registered handlers', () => {
  const router = makeRouter();
  router.registerSegmentHandler(1, s => parseInt(s));
  const result = router.resolve('/users/7');
  expect(result.segmentResults[1]).toBe(7);
});

test('resolve returns null for unknown route without throwing', () => {
  const router = makeRouter();
  const result = router.resolve('/unknown/path');
  expect(result).toBeNull();
});

test('getSegment returns correct segment', () => {
  const router = makeRouter();
  expect(router.getSegment('/posts/hello/comments', 1)).toBe('hello');
});

test('matchesSegment with string', () => {
  const router = makeRouter();
  expect(router.matchesSegment('/users/42', 0, 'users')).toBe(true);
  expect(router.matchesSegment('/users/42', 0, 'admin')).toBe(false);
});

test('matchesSegment with regex', () => {
  const router = makeRouter();
  expect(router.matchesSegment('/users/99', 1, /^\d+$/)).toBe(true);
});

test('segmentCount returns correct count', () => {
  const router = makeRouter();
  expect(router.segmentCount('/posts/hello/comments')).toBe(3);
});

test('unregisterSegmentHandler stops it from running', () => {
  const router = makeRouter();
  router.registerSegmentHandler(0, s => s.toUpperCase());
  router.unregisterSegmentHandler(0);
  const result = router.resolve('/users/1');
  expect(result.segmentResults[0]).toBeUndefined();
});
