import { withSignal } from './signal.router.js';

function makeRouter() {
  const routes = {};
  return {
    addRoute(path, handler) { routes[path] = handler; },
    navigate(path, opts = {}) { return { path, signal: opts.signal ?? null }; },
    resolve(path, opts = {}) {
      const handler = routes[path];
      return handler ? { handler, signal: opts.signal ?? null } : null;
    },
  };
}

describe('withSignal', () => {
  let router;

  beforeEach(() => {
    router = withSignal(makeRouter());
  });

  test('navigate passes a signal to underlying router', () => {
    const result = router.navigate('/home');
    expect(result.signal).toBeInstanceOf(AbortSignal);
    expect(result.path).toBe('/home');
  });

  test('second navigate aborts the first signal', () => {
    const r1 = router.navigate('/a');
    const r2 = router.navigate('/b');
    expect(r1.signal.aborted).toBe(true);
    expect(r2.signal.aborted).toBe(false);
  });

  test('resolve passes a signal', () => {
    router.addRoute('/about', () => 'about');
    const result = router.resolve('/about');
    expect(result).not.toBeNull();
    expect(result.signal).toBeInstanceOf(AbortSignal);
  });

  test('abortNavigation cancels current navigation', () => {
    const result = router.navigate('/page');
    expect(result.signal.aborted).toBe(false);
    router.abortNavigation();
    expect(result.signal.aborted).toBe(true);
  });

  test('abortNavigation returns false when nothing active', () => {
    expect(router.abortNavigation()).toBe(false);
  });

  test('addRoute delegates to underlying router', () => {
    router.addRoute('/x', () => 'x');
    const result = router.resolve('/x');
    expect(result).not.toBeNull();
  });

  test('_signals exposes the signal manager', () => {
    expect(typeof router._signals.size).toBe('function');
  });
});
