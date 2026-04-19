import { createRouter } from './router.js';
import { withMatcher } from './matcher.router.js';

function makeRouter() {
  const base = createRouter();
  return withMatcher(base);
}

describe('withMatcher', () => {
  test('matchPath works after addRoute', () => {
    const router = makeRouter();
    router.addRoute('/products/:id', () => {});
    const result = router.matchPath('/products/99');
    expect(result.matched).toBe(true);
    expect(result.params).toEqual({ id: '99' });
  });

  test('matchPath returns unmatched for unknown', () => {
    const router = makeRouter();
    const result = router.matchPath('/nope');
    expect(result.matched).toBe(false);
  });

  test('matchAllPaths returns multiple matches', () => {
    const router = makeRouter();
    router.addRoute('/items/:id', () => {});
    router.addRoute('/items/:slug', () => {});
    const results = router.matchAllPaths('/items/hello');
    expect(results.length).toBe(2);
  });

  test('resolve builds path from named route', () => {
    const router = makeRouter();
    router.addRoute('/users/:id/posts/:postId', () => {}, { name: 'userPost' });
    const path = router.resolve('userPost', { id: '5', postId: '12' });
    expect(path).toBe('/users/5/posts/12');
  });

  test('resolve returns null for unknown name', () => {
    const router = makeRouter();
    expect(router.resolve('ghost')).toBeNull();
  });

  test('hasNamed returns true for registered name', () => {
    const router = makeRouter();
    router.addRoute('/about', () => {}, { name: 'about' });
    expect(router.hasNamed('about')).toBe(true);
    expect(router.hasNamed('home')).toBe(false);
  });

  test('resolve throws on missing param', () => {
    const router = makeRouter();
    router.addRoute('/u/:id', () => {}, { name: 'user' });
    expect(() => router.resolve('user', {})).toThrow('Missing param: id');
  });
});
