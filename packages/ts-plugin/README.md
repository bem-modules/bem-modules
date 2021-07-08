# @bem-modules/ts-plugin

```sh
npm --save-dev i @bem-modules/ts-plugin
```

TypeScript plugin to enable type messages in IDE.

Add these lines to `tsconfig.json` to use:
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

Transforms `*.bem.css` files to (never seen by user) `*.d.ts` when TypeScript language service resolves imports.

Unfortunately, doesn't work with `tsc` ([feature request](https://github.com/microsoft/TypeScript/issues/16607)).

See [root package](https://github.com/bem-modules/bem-modules) for documentation.
See [example package](https://github.com/bem-modules/bem-modules/tree/master/packages/example) for full usage example.