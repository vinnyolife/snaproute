/**
 * Lazy route loading — async handler support for snaproute
 */

export function createLazyRoute(loader) {
  let cachedModule = null;

  return async function lazyHandler(context) {
    if (!cachedModule) {
      try {
        cachedModule = await loader();
      } catch (err) {
        throw new Error(`Failed to load lazy route: ${err.message}`);
      }
    }

    const handler =
      typeof cachedModule === 'function'
        ? cachedModule
        : cachedModule.default;

    if (typeof handler !== 'function') {
      throw new Error('Lazy route module must export a function as default or be a function.');
    }

    return handler(context);
  };
}

export function isLazyRoute(handler) {
  return typeof handler === 'function' && handler.name === 'lazyHandler';
}

export function prefetch(loader) {
  return loader().catch(() => {
    // silently ignore prefetch failures
  });
}
