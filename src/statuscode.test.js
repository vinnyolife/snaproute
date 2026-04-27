import { createStatusCodeManager } from './statuscode.js';

let manager;

beforeEach(() => {
  manager = createStatusCodeManager();
});

test('registers and retrieves a status code for a route', () => {
  manager.register('/home', 200);
  expect(manager.get('/home')).toBe(200);
});

test('returns null for unregistered route', () => {
  expect(manager.get('/missing')).toBeNull();
});

test('getOrDefault returns code if registered', () => {
  manager.register('/about', 403);
  expect(manager.getOrDefault('/about', 200)).toBe(403);
});

test('getOrDefault returns fallback if not registered', () => {
  expect(manager.getOrDefault('/nope', 200)).toBe(200);
});

test('throws if code is not a number', () => {
  expect(() => manager.register('/bad', '200')).toThrow(TypeError);
});

test('unregister removes a route', () => {
  manager.register('/foo', 200);
  manager.unregister('/foo');
  expect(manager.get('/foo')).toBeNull();
});

test('isOk returns true for 2xx codes', () => {
  manager.register('/ok', 201);
  expect(manager.isOk('/ok')).toBe(true);
});

test('isOk returns true for unregistered route (assume ok)', () => {
  expect(manager.isOk('/unknown')).toBe(true);
});

test('isOk returns false for 4xx codes', () => {
  manager.register('/blocked', 403);
  expect(manager.isOk('/blocked')).toBe(false);
});

test('isError returns true for 4xx and 5xx codes', () => {
  manager.register('/err', 500);
  expect(manager.isError('/err')).toBe(true);
});

test('isError returns false for unregistered route', () => {
  expect(manager.isError('/unknown')).toBe(false);
});

test('getByCode returns all routes with that code', () => {
  manager.register('/a', 404);
  manager.register('/b', 404);
  manager.register('/c', 200);
  expect(manager.getByCode(404)).toEqual(expect.arrayContaining(['/a', '/b']));
  expect(manager.getByCode(404)).toHaveLength(2);
});

test('getDefault returns built-in defaults', () => {
  expect(manager.getDefault('notFound')).toBe(404);
  expect(manager.getDefault('ok')).toBe(200);
  expect(manager.getDefault('unknown')).toBeNull();
});

test('size reflects registered count', () => {
  manager.register('/x', 200);
  manager.register('/y', 301);
  expect(manager.size()).toBe(2);
});

test('clear removes all entries', () => {
  manager.register('/x', 200);
  manager.clear();
  expect(manager.size()).toBe(0);
});

test('all returns a plain object snapshot', () => {
  manager.register('/home', 200);
  manager.register('/gone', 410);
  const snapshot = manager.all();
  expect(snapshot['/home']).toBe(200);
  expect(snapshot['/gone']).toBe(410);
});
