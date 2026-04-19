import { createRedirectManager, withRedirects } from './redirect.js';

describe('createRedirectManager', () => {
  let mgr;

  beforeEach(() => {
    mgr = createRedirectManager();
  });

  test('adds and resolves a redirect', () => {
    mgr.add('/old', '/new');
    expect(mgr.resolve('/old')).toEqual({ to: '/new', permanent: false });
  });

  test('permanent redirect flag', () => {
    mgr.add('/gone', '/here', { permanent: true });
    expect(mgr.resolve('/gone')).toEqual({ to: '/here', permanent: true });
  });

  test('returns null for unknown path', () => {
    expect(mgr.resolve('/unknown')).toBeNull();
  });

  test('supports function as redirect target', () => {
    mgr.add('/old', (path) => path.replace('/old', '/new'));
    expect(mgr.resolve('/old')).toEqual({ to: '/new', permanent: false });
  });

  test('has returns correct boolean', () => {
    mgr.add('/a', '/b');
    expect(mgr.has('/a')).toBe(true);
    expect(mgr.has('/b')).toBe(false);
  });

  test('remove deletes a redirect', () => {
    mgr.add('/a', '/b');
    mgr.remove('/a');
    expect(mgr.has('/a')).toBe(false);
  });

  test('clear removes all redirects', () => {
    mgr.add('/a', '/b');
    mgr.add('/c', '/d');
    mgr.clear();
    expect(mgr.size()).toBe(0);
  });

  test('size reflects current count', () => {
    mgr.add('/a', '/b');
    mgr.add('/c', '/d');
    expect(mgr.size()).toBe(2);
  });
});

describe('withRedirects', () => {
  test('intercepts navigate and redirects', () => {
    const calls = [];
    const mockRouter = { navigate: (path, opts) => calls.push({ path, opts }) };
    const mgr = createRedirectManager();
    mgr.add('/old', '/new');
    const router = withRedirects(mockRouter, mgr);
    router.navigate('/old');
    expect(calls[0].path).toBe('/new');
  });

  test('passes through non-redirected paths', () => {
    const calls = [];
    const mockRouter = { navigate: (path, opts) => calls.push({ path, opts }) };
    const mgr = createRedirectManager();
    const router = withRedirects(mockRouter, mgr);
    router.navigate('/normal');
    expect(calls[0].path).toBe('/normal');
  });
});
