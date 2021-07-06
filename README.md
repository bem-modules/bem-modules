# bem-modules

CSS modules for BEM with type checking and minification.

## Installation

```sh
npm i @bem-modules/bem TODO
```

## Example

Full example project [here](/tree/master/packages/example).

test.css:

```css
.block { /* ... */ }
.block__element { /* ... */ }
.block__element._modifier { /* ... */ }
.block__element._option_a { /* ... */ }
.block__element._option_b { /* ... */ }
```

test.ts:

```ts
import {bem} from './test.css';

const b = bem('block');

// = 'block'
const block = b();

// = 'block__element _modifier _option_a'
const element1 = b('element', {
    modifier: true,
    option: 'a',
});

// Error: no `foo` modifier
const element2 = b('element', {
    foo: 123,
});

// Error: no `bar` element
const element3 = b('bar');
```

webpack.config.ts:

```ts
TODO
```

## Documentation

TODO