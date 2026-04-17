# snaproute

Lightweight client-side router for vanilla JS apps with zero dependencies.

## Installation

```bash
npm install snaproute
```

Or include directly via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/snaproute/dist/snaproute.min.js"></script>
```

## Usage

```javascript
import { createRouter } from 'snaproute';

const router = createRouter({
  routes: [
    {
      path: '/',
      handler: () => {
        document.getElementById('app').innerHTML = '<h1>Home</h1>';
      }
    },
    {
      path: '/about',
      handler: () => {
        document.getElementById('app').innerHTML = '<h1>About</h1>';
      }
    },
    {
      path: '/user/:id',
      handler: ({ params }) => {
        document.getElementById('app').innerHTML = `<h1>User: ${params.id}</h1>`;
      }
    }
  ]
});

router.listen();
```

Navigate programmatically:

```javascript
router.navigate('/about');
```

## Features

- Zero dependencies
- Dynamic route parameters (`:param`)
- Hash and history mode support
- Tiny footprint (~1KB minified)

## License

[MIT](LICENSE)