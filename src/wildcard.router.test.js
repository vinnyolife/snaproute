import { withWildcard } from './wildcard.router.js';

function makeRouter(routes = {}) {
  return {
    resolve(path) {
      return routes[path] ?? null;
    },
    navigate(path) {
      return path;
    },
  };
}

describe('withWildcard', () => {
  test('delegates to base router when route matches', () => {
    const router = withWildcard(makeRouter({ '/home': { page: 'home' } }));
    expect(router.resolve('/home')).toEqual({ page: 'home' });
  });

  test('falls back to wildcard when base returns null', () => {
    const router = withWildcard(makeRouter());
    router.addWildcard('/files/*', () => 'file-handler');
    const result = router.resolve('/files/data.csv');
    expect(result).not.toBeNull();
    expect(result.wildcard).toBe('data.csv');
    expect(result.pattern).toBe('/files/*');
  });

  test('returns null when neither base nor wildcard match', () => {
    const router = withWildcard(makeRouter());
    expect(router.resolve('/unknown/path')).toBeNull();
  });

  test('removeWildcard stops matching removed pattern', () => {
    const router = withWildcard(makeRouter());
    router.addWildcard('/docs/**', () => {});
    router.removeWildcard('/docs/**');
    expect(router.resolve('/docs/intro')).toBeNull();
  });

  test('wildcardSize reflects added patterns', () => {
    const router = withWildcard(makeRouter());
    expect(router.wildcardSize()).toBe(0);
    router.addWildcard('/a/*', () => {});
    expect(router.wildcardSize()).toBe(1);
  });

  test('navigate delegates to base router', () => {
    const router = withWildcard(makeRouter());
    expect(router.navigate('/some/path')).toBe('/some/path');
  });

  test('double-star wildcard matches nested paths', () => {
    const router = withWildcard(makeRouter());
    router.addWildcard('/static/**', () => 'static');
    const result = router.resolve('/static/js/vendor/lib.min.js');
    expect(result).not.toBeNull();
    expect(result.wildcard).toBe('js/vendor/lib.min.js');
  });

  test('addWildcard is chainable', () => {
    const router = withWildcard(makeRouter());
    const ret = router.addWildcard('/x/*', () => {});
    expect(ret).toBe(router);
  });
});
