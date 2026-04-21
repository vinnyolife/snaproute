# Query Manager

`createQueryManager` provides a reactive, stateful API for managing URL query parameters in snaproute apps.

## Usage

```js
import { createQueryManager } from 'snaproute/query';

const query = createQueryManager();
```

## API

### `parse(search)` → `object`
Parses a query string (with or without leading `?`) into a plain object. Repeated keys become arrays.

```js
query.parse('?page=2&tag=a&tag=b');
// { page: '2', tag: ['a', 'b'] }
```

### `stringify(params)` → `string`
Serializes an object back to a query string. Arrays are expanded into repeated keys.

```js
query.stringify({ sort: 'asc', tag: ['x', 'y'] });
// '?sort=asc&tag=x&tag=y'
```

### `load(search)`
Replaces the internal state by parsing the given search string.

### `merge(search)`
Merges parsed values from `search` into the current state.

### `set(params)`
Merges a plain object into the current state.

### `unset(...keys)`
Removes the specified keys from the current state.

### `get(key?)` → `string | string[] | object`
Returns the value for a key, or all params if no key is given.

### `has(key)` → `boolean`
Returns `true` if the key exists in the current state.

### `clear()`
Resets all params.

### `toSearch()` → `string`
Serializes the current state to a query string.

## Example with

```js
const query = createQueryManager();

router.beforeEach((to) => {
  query.load(to.search);
});

// Later, navigate with updated params
query.set({ page: '2' });
router.navigate('/products' + query.toSearch());
```
