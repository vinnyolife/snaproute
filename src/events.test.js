import { createEventBus } from './events.js';

let bus;
beforeEach(() => { bus = createEventBus(); });

test('on + emit calls handler', () => {
  const fn = jest.fn();
  bus.on('navigate', fn);
  bus.emit('navigate', '/home');
  expect(fn).toHaveBeenCalledWith('/home');
});

test('off removes handler', () => {
  const fn = jest.fn();
  bus.on('navigate', fn);
  bus.off('navigate', fn);
  bus.emit('navigate', '/home');
  expect(fn).not.toHaveBeenCalled();
});

test('on returns unsubscribe function', () => {
  const fn = jest.fn();
  const unsub = bus.on('navigate', fn);
  unsub();
  bus.emit('navigate', '/home');
  expect(fn).not.toHaveBeenCalled();
});

test('once fires only once', () => {
  const fn = jest.fn();
  bus.once('load', fn);
  bus.emit('load');
  bus.emit('load');
  expect(fn).toHaveBeenCalledTimes(1);
});

test('emit with no listeners does nothing', () => {
  expect(() => bus.emit('unknown')).not.toThrow();
});

test('clear specific event', () => {
  const fn = jest.fn();
  bus.on('a', fn);
  bus.on('b', fn);
  bus.clear('a');
  bus.emit('a');
  bus.emit('b');
  expect(fn).toHaveBeenCalledTimes(1);
});

test('clear all events', () => {
  const fn = jest.fn();
  bus.on('a', fn);
  bus.on('b', fn);
  bus.clear();
  bus.emit('a');
  bus.emit('b');
  expect(fn).not.toHaveBeenCalled();
});

test('size returns correct count', () => {
  const fn = jest.fn();
  bus.on('x', fn);
  bus.on('x', jest.fn());
  bus.on('y', fn);
  expect(bus.size('x')).toBe(2);
  expect(bus.size('y')).toBe(1);
  expect(bus.size()).toBe(3);
});

test('handler errors are caught and do not break other handlers', () => {
  const bad = jest.fn(() => { throw new Error('oops'); });
  const good = jest.fn();
  bus.on('ev', bad);
  bus.on('ev', good);
  expect(() => bus.emit('ev')).not.toThrow();
  expect(good).toHaveBeenCalled();
});
