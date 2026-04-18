import { createErrorHandler, createRouteError } from './errors.js';

describe('createErrorHandler', () => {
  let handler;

  beforeEach(() => {
    handler = createErrorHandler();
  });

  test('registers and calls handler by status code', () => {
    const fn = jest.fn();
    handler.on(404, fn);
    const err = createRouteError('Not found', 404);
    handler.handle(err, { path: '/missing' });
    expect(fn).toHaveBeenCalledWith(err, { path: '/missing' });
  });

  test('falls back to fallback handler when no match', () => {
    const fb = jest.fn();
    handler.onFallback(fb);
    const err = createRouteError('Server error', 500);
    handler.handle(err);
    expect(fb).toHaveBeenCalledWith(err, {});
  });

  test('prefers specific handler over fallback', () => {
    const specific = jest.fn();
    const fb = jest.fn();
    handler.on(403, specific);
    handler.onFallback(fb);
    handler.handle(createRouteError('Forbidden', 403));
    expect(specific).toHaveBeenCalled();
    expect(fb).not.toHaveBeenCalled();
  });

  test('remove deletes a handler', () => {
    const fn = jest.fn();
    handler.on(404, fn);
    handler.remove(404);
    expect(handler.size()).toBe(0);
  });

  test('clear removes all handlers and fallback', () => {
    handler.on(404, () => {});
    handler.on(500, () => {});
    handler.onFallback(() => {});
    handler.clear();
    expect(handler.size()).toBe(0);
  });

  test('throws on invalid statusCode type', () => {
    expect(() => handler.on('404', () => {})).toThrow(TypeError);
  });

  test('throws on non-function handler', () => {
    expect(() => handler.on(404, 'nope')).toThrow(TypeError);
  });

  test('uses error.status if statusCode missing', () => {
    const fn = jest.fn();
    handler.on(401, fn);
    const err = new Error('Unauthorized');
    err.status = 401;
    handler.handle(err);
    expect(fn).toHaveBeenCalled();
  });
});

describe('createRouteError', () => {
  test('creates error with statusCode', () => {
    const err = createRouteError('Not found', 404);
    expect(err.message).toBe('Not found');
    expect(err.statusCode).toBe(404);
  });

  test('merges extra properties', () => {
    const err = createRouteError('Bad', 400, { field: 'name' });
    expect(err.field).toBe('name');
  });

  test('defaults to 500', () => {
    const err = createRouteError('Oops');
    expect(err.statusCode).toBe(500);
  });
});
