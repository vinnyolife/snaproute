import { createCooldownManager } from './cooldown.js';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('createCooldownManager', () => {
  let cm;

  beforeEach(() => {
    cm = createCooldownManager();
  });

  test('registers a cooldown for a route', () => {
    cm.register('/home', 500);
    expect(cm.getCooldown('/home')).toBe(500);
  });

  test('throws on invalid route', () => {
    expect(() => cm.register('', 100)).toThrow();
    expect(() => cm.register(42, 100)).toThrow();
  });

  test('throws on invalid ms', () => {
    expect(() => cm.register('/home', -1)).toThrow();
    expect(() => cm.register('/home', 'fast')).toThrow();
  });

  test('returns null for unregistered route with no default', () => {
    expect(cm.getCooldown('/unknown')).toBeNull();
  });

  test('uses default cooldown for unregistered routes', () => {
    cm.setDefault(300);
    expect(cm.getCooldown('/anything')).toBe(300);
  });

  test('isOnCooldown returns false before recording', () => {
    cm.register('/home', 500);
    expect(cm.isOnCooldown('/home')).toBe(false);
  });

  test('isOnCooldown returns true immediately after recording', () => {
    cm.register('/home', 500);
    cm.record('/home');
    expect(cm.isOnCooldown('/home')).toBe(true);
  });

  test('isOnCooldown returns false after cooldown expires', async () => {
    cm.register('/home', 30);
    cm.record('/home');
    await wait(50);
    expect(cm.isOnCooldown('/home')).toBe(false);
  });

  test('remainingTime returns 0 when not recorded', () => {
    cm.register('/home', 500);
    expect(cm.remainingTime('/home')).toBe(0);
  });

  test('remainingTime returns positive value during cooldown', () => {
    cm.register('/home', 500);
    cm.record('/home');
    expect(cm.remainingTime('/home')).toBeGreaterThan(0);
  });

  test('reset clears timestamp so isOnCooldown returns false', () => {
    cm.register('/home', 500);
    cm.record('/home');
    cm.reset('/home');
    expect(cm.isOnCooldown('/home')).toBe(false);
  });

  test('unregister removes route cooldown and timestamp', () => {
    cm.register('/home', 500);
    cm.record('/home');
    cm.unregister('/home');
    expect(cm.getCooldown('/home')).toBeNull();
    expect(cm.isOnCooldown('/home')).toBe(false);
  });

  test('clear removes all cooldowns and timestamps', () => {
    cm.register('/a', 100);
    cm.register('/b', 200);
    cm.record('/a');
    cm.clear();
    expect(cm.size()).toBe(0);
    expect(cm.isOnCooldown('/a')).toBe(false);
  });

  test('size reflects number of registered cooldowns', () => {
    cm.register('/x', 100);
    cm.register('/y', 200);
    expect(cm.size()).toBe(2);
  });
});
