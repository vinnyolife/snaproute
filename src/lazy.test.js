import { createLazyRoute, isLazyRoute, prefetch } from './lazy.js';

describe('createLazyRoute', () => {
  it('calls the loader and invokes the default export handler', async () => {
    const handler = jest.fn().mockResolvedValue('result');
    const loader = jest.fn().mockResolvedValue({ default: handler });
    const lazy = createLazyRoute(loader);

    const ctx = { path: '/home' };
    const result = await lazy(ctx);

    expect(loader).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(ctx);
    expect(result).toBe('result');
  });

  it('caches the module after first load', async () => {
    const handler = jest.fn();
    const loader = jest.fn().mockResolvedValue({ default: handler });
    const lazy = createLazyRoute(loader);

    await lazy({});
    await lazy({});

    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('works when module itself is a function', async () => {
    const handler = jest.fn().mockReturnValue('ok');
    const loader = jest.fn().mockResolvedValue(handler);
    const lazy = createLazyRoute(loader);

    const result = await lazy({});
    expect(result).toBe('ok');
  });

  it('throws if loader fails', async () => {
    const loader = jest.fn().mockRejectedValue(new Error('network error'));
    const lazy = createLazyRoute(loader);

    await expect(lazy({})).rejects.toThrow('Failed to load lazy route: network error');
  });

  it('throws if module has no callable export', async () => {
    const loader = jest.fn().mockResolvedValue({ default: 42 });
    const lazy = createLazyRoute(loader);

    await expect(lazy({})).rejects.toThrow('must export a function');
  });
});

describe('isLazyRoute', () => {
  it('returns true for lazy handlers', () => {
    const lazy = createLazyRoute(() => Promise.resolve(() => {}));
    expect(isLazyRoute(lazy)).toBe(true);
  });

  it('returns false for regular functions', () => {
    expect(isLazyRoute(() => {})).toBe(false);
  });
});

describe('prefetch', () => {
  it('calls loader eagerly', async () => {
    const loader = jest.fn().mockResolvedValue({});
    await prefetch(loader);
    expect(loader).toHaveBeenCalled();
  });

  it('does not throw on failure', async () => {
    const loader = jest.fn().mockRejectedValue(new Error('fail'));
    await expect(prefetch(loader)).resolves.toBeUndefined();
  });
});
