# bem-modules

CSS modules for BEM with type checking and minification.

## Installation

```sh
# Runtime
npm i @bem-modules/bem

# Webpack loader
npm i --save-dev @bem-modules/loader

# TypeScript plugin
npm i --save-dev @bem/ts-plugin
```

## Usage

Full example project [here](https://github.com/bem-modules/bem-modules/tree/master/packages/example).

`test.css`:

```css
.block { /* ... */ }
.block__element { /* ... */ }
.block__element._modifier { /* ... */ }
.block__element._option_a { /* ... */ }
.block__element._option_b { /* ... */ }
```

`test.ts`:

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

`tsconfig.json`:

```json
{
    "compilerOptions": {
        "plugins": [
            {
                "name": "@bem-modules/ts-plugin"
            }
        ]
    }
}
```

`webpack.config.ts`:

```ts
{
    test: /\.bem\.css$/,
    use: [
        {
            loader: '@bem-modules/loader',
        },
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
            },
        },
    ],
}
```