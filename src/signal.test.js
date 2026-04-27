import { createSignalManager } from './signal.js';

describe('createSignalManager', () => {
  let sm;

  beforeEach(() => {
    sm = createSignalManager();
  });

  test('create returns an AbortSignal', () => {
    const signal = sm.create('nav-1');
    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal.aborted).toBe(false);
  });

  test('has returns true after create', () => {
    sm.create('nav-1');
    expect(sm.has('nav-1')).toBe(true);
  });

  test('abort cancels signal and returns true', () => {
    const signal = sm.create('nav-1');
    const result = sm.abort('nav-1');
    expect(result).toBe(true);
    expect(signal.aborted).toBe(true);
    expect(sm.has('nav-1')).toBe(false);
  });

  test('abort returns false for unknown key', () => {
    expect(sm.abort('missing')).toBe(false);
  });

  test('creating same key aborts previous signal', () => {
    const sig1 = sm.create('nav-1');
    const sig2 = sm.create('nav-1');
    expect(sig1.aborted).toBe(true);
    expect(sig2.aborted).toBe(false);
  });

  test('isAborted reflects signal state', () => {
    sm.create('nav-1');
    expect(sm.isAborted('nav-1')).toBe(false);
    sm.abort('nav-1');
    expect(sm.isAborted('nav-1')).toBe(false); // removed after abort
  });

  test('isAborted returns false for unknown key', () => {
    expect(sm.isAborted('x')).toBe(false);
  });

  test('abortAll cancels all signals', () => {
    const s1 = sm.create('a');
    const s2 = sm.create('b');
    sm.abortAll();
    expect(s1.aborted).toBe(true);
    expect(s2.aborted).toBe(true);
    expect(sm.size()).toBe(0);
  });

  test('remove deletes without aborting', () => {
    const sig = sm.create('nav-1');
    sm.remove('nav-1');
    expect(sm.has('nav-1')).toBe(false);
    expect(sig.aborted).toBe(false);
  });

  test('size tracks active controllers', () => {
    sm.create('a');
    sm.create('b');
    expect(sm.size()).toBe(2);
    sm.abort('a');
    expect(sm.size()).toBe(1);
  });
});
