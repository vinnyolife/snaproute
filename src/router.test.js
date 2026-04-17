import { createRouter } from './router.js';

describe('createRouter', () => {
  let router;

  beforeEach(() => {
    router = createRouter();
  });

  test('resolves a static route', () => {
    const handler = jest.fn();
    router.addRoute('/about', handler);

    const result = router.resolve('/about');
    expect(result).not.toBeNull();
    expect(result.params).toEqual({});
  });

  test('resolves a dynamic route and extracts params', () => {
    const handler = jest.fn();
    router.addRoute('/users/:id', handler);

    const result = router.resolve('/users/42');
    expect(result).not.toBeNull();
    expect(result.params).toEqual({ id: '42' });
  });

  test('resolves route with multiple params', () => {
    const handler = jest.fn();
    router.addRoute('/posts/:year/:slug', handler);

    const result = router.resolve('/posts/2024/hello-world');
    expect(result.params).toEqual({ year: '2024', slug: 'hello-world' });
  });

  test('returns null for unmatched route with no notFound handler', () => {
    const result = router.resolve('/does-not-exist');
    expect(result).toBeNull();
  });

  test('returns notFound handler for unmatched route', () => {
    const fallback = jest.fn();
    router.onNotFound(fallback);

    const result = router.resolve('/missing');
    expect(result).not.toBeNull();
    expect(result.handler).toBe(fallback);
  });

  test('does not match partial paths', () => {
    router.addRoute('/about', jest.fn());
    const result = router.resolve('/about/team');
    expect(result).toBeNull();
  });

  test('decodes URI components in params', () => {
    router.addRoute('/search/:query', jest.fn());
    const result = router.resolve('/search/hello%20world');
    expect(result.params.query).toBe('hello world');
  });
});
