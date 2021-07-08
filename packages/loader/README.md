# @bem-modules/loader

```sh
npm --save-dev i @bem-modules/loader
# runtime:
npm i @bem-modules/bem
```

Webpack loader to transform typed BEM module imports.

Add as first loader to Webpack configuation for `*.bem.css` files:

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

Transforms CSS imports into imports of BEM modules runtime:

```ts
import {bem} from './index.bem.css';
```

into

```ts
import {bem} from '@bem-modules/bem';
```

Unfortunately, doesn't work with `tsc` ([feature request](https://github.com/microsoft/TypeScript/issues/16607)).

See [root package](https://github.com/bem-modules/bem-modules) for documentation.
See [example package](https://github.com/bem-modules/bem-modules/tree/master/packages/example) for full usage example.