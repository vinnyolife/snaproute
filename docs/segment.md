# Segment

The segment module lets you inspect, match, and transform individual URL path segments by index.

## createSegmentManager

```js
import { createSegmentManager } from './segment.js';
const seg = createSegmentManager();
```

### get(path, index)

Returns the segment at the given zero-based index, or `undefined` if out of bounds.

```js
seg.get('/users/42/profile', 1); // '42'
```

### getAll(path)

Splits the path into an array of segment strings.

```js
seg.getAll('/a/b/c'); // ['a', 'b', 'c']
```

### count(path)

Returns the number of non-empty segments.

```js
seg.count('/a/b/c'); // 3
```

### matches(path, index, value)

Checks whether the segment at `index` matches `value`. Value can be a string, RegExp, or predicate function.

```js
seg.matches('/users/42', 1, /^\d+$/); // true
```

### register(index, handler) / unregister(index)

Attach a transform function to a segment index. Called by `run()`.

```js
seg.register(0, s => s.toUpperCase());
```

### run(path)

Runs all registered handlers against the corresponding segments and returns a results map keyed by index.

```js
seg.register(1, s => parseInt(s));
seg.run('/users/7'); // { 1: 7 }
```

## withSegment(router)

Wraps a snaproute router and enriches resolved results with `segments` and `segmentResults`.

```js
import { withSegment } from './segment.router.js';
const router = withSegment(createRouter());
router.registerSegmentHandler(1, s => parseInt(s));
const result = router.resolve('/users/5');
// result.segments => ['users', '5']
// result.segmentResults => { 1: 5 }
```
