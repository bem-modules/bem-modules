# @bem-modules/bem

```sh
npm i @bem-modules/bem
```

Class name generation helper.

May be used separately from the rest of the project, yet with weaker type checking.

```ts
const b = bem('block');

b() // 'block'
b('element') // 'block__element'
b({bool: true}) // 'block _bool'
b({bool: false}) // 'block'
b({camelCase: true}) // 'block _camel-case'
b({foo: 'bar'}) // 'block _foo_bar'
b('element', {camelCase: true}) // 'block__element _camel-case',
b('element', {bool: true}) // 'block__element _bool'
b('element', {bool: false}) // 'block__element'
b('element', {foo: 'bar'}) // 'block__element _foo_bar'
```

See [root package](https://github.com/bem-modules/bem-modules) for documentation.
See [example package](https://github.com/bem-modules/bem-modules/tree/master/packages/example) for full usage example.