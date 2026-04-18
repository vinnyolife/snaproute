import { createHooks } from './hooks.js';

describe('createHooks', () => {
  let hooks;

  beforeEach(() => {
    hooks = createHooks();
  });

  test('runBeforeEach calls all registered beforeEach hooks', async () => {
    const calls = [];
    hooks.beforeEach((to, from) => calls.push({ to, from }));
    hooks.beforeEach((to, from) => calls.push({ to, from }));
    await hooks.runBeforeEach('/about', '/');
    expect(calls).toHaveLength(2);
    expect(calls[0]).toEqual({ to: '/about', from: '/' });
  });

  test('runBeforeEach returns false if a hook returns false', async () => {
    hooks.beforeEach(() => false);
    const result = await hooks.runBeforeEach('/admin', '/');
    expect(result).toBe(false);
  });

  test('runBeforeEach returns true when all hooks pass', async () => {
    hooks.beforeEach(() => true);
    const result = await hooks.runBeforeEach('/home', '/');
    expect(result).toBe(true);
  });

  test('runAfterEach calls all afterEach hooks', async () => {
    const called = [];
    hooks.afterEach((to) => called.push(to));
    await hooks.runAfterEach('/about', '/');
    expect(called).toEqual(['/about']);
  });

  test('runOnError calls error handlers with err and context', async () => {
    const errors = [];
    hooks.onError((err, to) => errors.push({ err, to }));
    const e = new Error('oops');
    await hooks.runOnError(e, '/fail', '/');
    expect(errors[0].err).toBe(e);
    expect(errors[0].to).toBe('/fail');
  });

  test('beforeEach returns unsubscribe function', async () => {
    const calls = [];
    const unsub = hooks.beforeEach(() => calls.push(1));
    unsub();
    await hooks.runBeforeEach('/x', '/');
    expect(calls).toHaveLength(0);
  });

  test('clear removes all hooks', async () => {
    const calls = [];
    hooks.beforeEach(() => calls.push('before'));
    hooks.afterEach(() => calls.push('after'));
    hooks.clear();
    await hooks.runBeforeEach('/a', '/');
    await hooks.runAfterEach('/a', '/');
    expect(calls).toHaveLength(0);
  });
});
