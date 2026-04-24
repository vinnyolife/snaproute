import { createRateLimitManager } from './ratelimit.js';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('createRateLimitManager', () => {
  let rl;

  beforeEach(() => {
    rl = createRateLimitManager();
  });

  test('allows requests when no limit is set', () => {
    const result = rl.check('home');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(Infinity);
  });

  test('setLimit registers a limit', () => {
    rl.setLimit('api', 3, 1000);
    expect(rl.size()).toBe(1);
  });

  test('throws on invalid maxHits', () => {
    expect(() => rl.setLimit('x', 0, 1000)).toThrow('maxHits');
    expect(() => rl.setLimit('x', -1, 1000)).toThrow('maxHits');
  });

  test('throws on invalid windowMs', () => {
    expect(() => rl.setLimit('x', 1, 0)).toThrow('windowMs');
  });

  test('consume allows up to maxHits', () => {
    rl.setLimit('route', 3, 5000);
    expect(rl.consume('route').allowed).toBe(true);
    expect(rl.consume('route').allowed).toBe(true);
    expect(rl.consume('route').allowed).toBe(true);
    const blocked = rl.consume('route');
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  test('remaining decrements with each consume', () => {
    rl.setLimit('r', 3, 5000);
    expect(rl.consume('r').remaining).toBe(2);
    expect(rl.consume('r').remaining).toBe(1);
    expect(rl.consume('r').remaining).toBe(0);
  });

  test('check does not consume a hit', () => {
    rl.setLimit('r', 2, 5000);
    rl.check('r');
    rl.check('r');
    expect(rl.consume('r').allowed).toBe(true);
    expect(rl.consume('r').allowed).toBe(true);
    expect(rl.consume('r').allowed).toBe(false);
  });

  test('blocked result includes resetIn > 0', () => {
    rl.setLimit('r', 1, 5000);
    rl.consume('r');
    const result = rl.check('r');
    expect(result.allowed).toBe(false);
    expect(result.resetIn).toBeGreaterThan(0);
  });

  test('hits expire after window', async () => {
    rl.setLimit('r', 1, 50);
    rl.consume('r');
    expect(rl.check('r').allowed).toBe(false);
    await wait(60);
    expect(rl.check('r').allowed).toBe(true);
  });

  test('remove clears a limit', () => {
    rl.setLimit('r', 1, 1000);
    rl.remove('r');
    expect(rl.size()).toBe(0);
    expect(rl.check('r').allowed).toBe(true);
  });

  test('clear removes all limits', () => {
    rl.setLimit('a', 1, 1000);
    rl.setLimit('b', 2, 1000);
    rl.clear();
    expect(rl.size()).toBe(0);
  });
});
