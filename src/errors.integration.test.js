import { createErrorHandler, createRouteError } from './errors.js';
import { withErrorHandling } from './errors.router.js';

function makeMockRouter() {
  return {
    dispatch: jest.fn().mockResolvedValue({ matched: true }),
  };
}

describe('withErrorHandling integration', () => {
  test('passes through successful dispatch', async () => {
    const router = makeMockRouter();
    const errors = createErrorHandler();
    withErrorHandling(router, errors);
    const result = await router.dispatch('/home');
    expect(result).toEqual({ matched: true });
  });

  test('catches thrown error and routes to handler', async () => {
    const router = makeMockRouter();
    router.dispatch = jest.fn().mockRejectedValue(createRouteError('Not found', 404));
    const errors = createErrorHandler();
    const fn = jest.fn();
    errors.on(404, fn);
    withErrorHandling(router, errors);
    await router.dispatch('/missing');
    expect(fn).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }), { path: '/missing' });
  });

  test('notFound registers 404 handler', async () => {
    const router = makeMockRouter();
    router.dispatch = jest.fn().mockRejectedValue(createRouteError('Not found', 404));
    const errors = createErrorHandler();
    withErrorHandling(router, errors);
    const fn = jest.fn();
    router.notFound(fn);
    await router.dispatch('/nope');
    expect(fn).toHaveBeenCalled();
  });

  test('onError with fallback function', async () => {
    const router = makeMockRouter();
    router.dispatch = jest.fn().mockRejectedValue(createRouteError('Boom', 503));
    const errors = createErrorHandler();
    withErrorHandling(router, errors);
    const fb = jest.fn();
    router.onError(fb);
    await router.dispatch('/boom');
    expect(fb).toHaveBeenCalled();
  });

  test('onError with specific code', async () => {
    const router = makeMockRouter();
    router.dispatch = jest.fn().mockRejectedValue(createRouteError('Forbidden', 403));
    const errors = createErrorHandler();
    withErrorHandling(router, errors);
    const fn = jest.fn();
    router.onError(403, fn);
    await router.dispatch('/secret');
    expect(fn).toHaveBeenCalled();
  });
});
