import { createTransitions } from './transitions.js';

describe('createTransitions', () => {
  let t;
  beforeEach(() => { t = createTransitions(); });

  test('define and get a transition', () => {
    const enter = () => {};
    const leave = () => {};
    t.define('fade', { enter, leave });
    const tr = t.get('fade');
    expect(tr.enter).toBe(enter);
    expect(tr.leave).toBe(leave);
  });

  test('get returns null for unknown transition', () => {
    expect(t.get('nope')).toBeNull();
  });

  test('define throws on invalid name', () => {
    expect(() => t.define('', {})).toThrow();
    expect(() => t.define(null, {})).toThrow();
  });

  test('run calls enter hook', async () => {
    const enter = jest.fn();
    t.define('slide', { enter });
    await t.run('slide', 'enter', { path: '/a' });
    expect(enter).toHaveBeenCalledWith({ path: '/a' });
  });

  test('run calls leave hook', async () => {
    const leave = jest.fn();
    t.define('slide', { leave });
    await t.run('slide', 'leave', { path: '/b' });
    expect(leave).toHaveBeenCalledWith({ path: '/b' });
  });

  test('run does nothing for unknown transition', async () => {
    await expect(t.run('ghost', 'enter', {})).resolves.toBeUndefined();
  });

  test('between calls leave then enter in order', async () => {
    const order = [];
    t.define('a', { leave: () => order.push('leave-a') });
    t.define('b', { enter: () => order.push('enter-b') });
    await t.between('a', 'b', {});
    expect(order).toEqual(['leave-a', 'enter-b']);
  });

  test('remove deletes a transition', () => {
    t.define('fade', { enter: () => {} });
    t.remove('fade');
    expect(t.get('fade')).toBeNull();
  });

  test('clear removes all transitions', () => {
    t.define('a', {}); t.define('b', {});
    t.clear();
    expect(t.list()).toHaveLength(0);
  });

  test('list returns all defined names', () => {
    t.define('x', {}); t.define('y', {});
    expect(t.list()).toEqual(expect.arrayContaining(['x', 'y']));
  });
});
