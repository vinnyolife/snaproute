import { createMiddlewarePipeline, loggerMiddleware, guardMiddleware } from './middleware.js';

describe('createMiddlewarePipeline', () => {
  test('runs middlewares in order', (done) => {
    const pipeline = createMiddlewarePipeline();
    const order = [];

    pipeline.use((ctx, next) => { order.push(1); next(); });
    pipeline.use((ctx, next) => { order.push(2); next(); });
    pipeline.use((ctx, next) => { order.push(3); next(); });

    pipeline.run({}, (err) => {
      expect(err).toBeNull();
      expect(order).toEqual([1, 2, 3]);
      done();
    });
  });

  test('passes context through pipeline', (done) => {
    const pipeline = createMiddlewarePipeline();

    pipeline.use((ctx, next) => { ctx.visited = true; next(); });

    pipeline.run({ path: '/home' }, (err, ctx) => {
      expect(ctx.visited).toBe(true);
      expect(ctx.path).toBe('/home');
      done();
    });
  });

  test('stops pipeline on error', (done) => {
    const pipeline = createMiddlewarePipeline();
    const order = [];

    pipeline.use((ctx, next) => { order.push(1); next(new Error('blocked')); });
    pipeline.use((ctx, next) => { order.push(2); next(); });

    pipeline.run({}, (err) => {
      expect(err).not.toBeNull();
      expect(order).toEqual([1]);
      done();
    });
  });

  test('throws if non-function passed to use', () => {
    const pipeline = createMiddlewarePipeline();
    expect(() => pipeline.use('not a function')).toThrow();
  });

  test('clear removes all middlewares', () => {
    const pipeline = createMiddlewarePipeline();
    pipeline.use((ctx, next) => next());
    pipeline.clear();
    expect(pipeline.size()).toBe(0);
  });
});

describe('guardMiddleware', () => {
  test('blocks navigation when predicate returns false', (done) => {
    const pipeline = createMiddlewarePipeline();
    const guard = guardMiddleware(() => false, '/login');
    pipeline.use(guard);

    const ctx = { path: '/dashboard' };
    pipeline.run(ctx, (err) => {
      expect(err).not.toBeNull();
      expect(ctx.redirect).toBe('/login');
      done();
    });
  });

  test('allows navigation when predicate returns true', (done) => {
    const pipeline = createMiddlewarePipeline();
    const guard = guardMiddleware(() => true, '/login');
    pipeline.use(guard);

    pipeline.run({ path: '/dashboard' }, (err) => {
      expect(err).toBeNull();
      done();
    });
  });
});
