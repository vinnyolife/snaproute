import { createGuards } from './guards.js';

describe('createGuards', () => {
  let guards;

  beforeEach(() => {
    guards = createGuards();
  });

  test('allows navigation when no guards registered', async () => {
    const result = await guards.run('/a', '/b');
    expect(result).toEqual({ allowed: true });
  });

  test('allows navigation when guard returns undefined', async () => {
    guards.add(() => undefined);
    const result = await guards.run('/a', '/b');
    expect(result.allowed).toBe(true);
  });

  test('blocks navigation when guard returns false', async () => {
    guards.add(() => false);
    const result = await guards.run('/a', '/b');
    expect(result).toEqual({ allowed: false, reason: null });
  });

  test('redirects when guard returns a string', async () => {
    guards.add(() => '/login');
    const result = await guards.run('/dashboard', '/settings');
    expect(result).toEqual({ allowed: false, redirect: '/login' });
  });

  test('blocks and captures thrown errors', async () => {
    const err = new Error('unauthorized');
    guards.add(() => { throw err; });
    const result = await guards.run('/a', '/b');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe(err);
  });

  test('runs guards in order and stops at first block', async () => {
    const calls = [];
    guards.add(() => { calls.push(1); });
    guards.add(() => { calls.push(2); return false; });
    guards.add(() => { calls.push(3); });
    await guards.run('/a', '/b');
    expect(calls).toEqual([1, 2]);
  });

  test('remove unregisters a guard', async () => {
    const fn = () => false;
    const unregister = guards.add(fn);
    unregister();
    const result = await guards.run('/a', '/b');
    expect(result.allowed).toBe(true);
  });

  test('clear removes all guards', async () => {
    guards.add(() => false);
    guards.add(() => false);
    guards.clear();
    expect(guards.size()).toBe(0);
    const result = await guards.run('/a', '/b');
    expect(result.allowed).toBe(true);
  });

  test('supports async guards', async () => {
    guards.add(async (from, to) => {
      await Promise.resolve();
      return to === '/secret' ? false : undefined;
    });
    expect((await guards.run('/a', '/secret')).allowed).toBe(false);
    expect((await guards.run('/a', '/home')).allowed).toBe(true);
  });
});
