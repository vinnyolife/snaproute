/**
 * snaproute — Lightweight client-side router for vanilla JS apps
 *
 * Main entry point. Re-exports all public modules.
 */

export { createRouter, addRoute, resolve, dispatch, navigate } from './router.js';
export { createMiddlewarePipeline } from './middleware.js';
export { parsePattern, extractParams, parseQuery, stringifyQuery, buildPath } from './params.js';
export { createHooks } from './hooks.js';
export { createHistory } from './history.js';
export { createLazyRoute, isLazyRoute, prefetch as prefetchLazy } from './lazy.js';
export { createTransitions } from './transitions.js';
export { createGuards } from './guards.js';
export { createScrollManager } from './scroll.js';
export { withScrollRestoration } from './scroll.router.js';
export { createPrefetchManager } from './prefetch.js';
export { createErrorHandler } from './errors.js';
export { withErrorHandling } from './errors.router.js';
export { createCache } from './cache.js';
export { withCache } from './cache.router.js';
export { createBreadcrumbs } from './breadcrumbs.js';
export { createNotFoundHandler } from './notfound.js';
export { createRedirectManager } from './redirect.js';
export { createAnalytics } from './analytics.js';
export { createMatcher } from './matcher.js';
export { withMatcher } from './matcher.router.js';
export { createEventBus } from './events.js';
export { createMetaManager } from './meta.js';
export { withMeta } from './meta.router.js';
export { createTitleManager } from './title.js';
export { withTitle } from './title.router.js';
export { createLocaleManager } from './locale.js';
export { createTimeoutManager } from './timeout.js';
export { createBasepathManager } from './basepath.js';
export { createDebounceManager } from './debounce.js';
export { createPipeline } from './pipeline.js';
export { createWildcardManager } from './wildcard.js';
export { withWildcard } from './wildcard.router.js';
export { createQueryManager } from './query.js';
export { createFallbackManager } from './fallback.js';
export { createRateLimitManager } from './ratelimit.js';
export { createRetryManager } from './retry.js';
export { createPriorityManager } from './priority.js';
export { withPriority } from './priority.router.js';
export { createAliasManager } from './alias.js';
export { withAlias } from './alias.router.js';
export { createGroupManager } from './groups.js';
export { createTagManager } from './tags.js';
export { withTags } from './tags.router.js';
export { createCooldownManager } from './cooldown.js';
export { createNormalizeManager } from './normalize.js';
export { createVersionManager } from './version.js';
export { withVersion } from './version.router.js';
export { createScopeManager } from './scope.js';
export { createFreezeManager } from './freeze.js';
export { createBlacklistManager } from './blacklist.js';
export { createCheckpointManager } from './checkpoint.js';
export { createStatusCodeManager } from './statuscode.js';
export { createThrottleManager } from './throttle.js';
export { createSegmentManager } from './segment.js';
export { withSegment } from './segment.router.js';
export { createSignalManager } from './signal.js';
export { withSignal } from './signal.router.js';
export { createBatchManager } from './batch.js';
export { withBatch } from './batch.router.js';

/** Library version */
export const VERSION = '1.0.0';
