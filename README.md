# rel

Use React without a transpiler!

## Features

 - No transpilation required! ES6 tagged template string literals are a part of the language!
 - Works on client, server and native.
 - Interops with your existing JSX code. No need to rush!
 - Tiny codebase - you can hope to understand it if you have any problems, and there's a smaller chance of being bugs
 - `xml:id` and other XML namespaced attributes simply work! Also XML namespaced tags such as `<xlink:href>`

## Example

```javascript
const rel = require('rel')

// Look ma, no transpilers!
function YourComponent({ kind }) {
  const className = `foo foo__${kind}`
  return rel`<div className=${className} onClick=${(e) => this.onClick(e)} />`
}
```

## Interpolating strings

```javascript
const rel = require('rel')

function AmazingTitle({ name = 'Fábio' }) {
  return rel`
    <h1>Hello, ${name}</h1>
  `
}
```

## Use it with your other components

```javascript
const rel = require('rel')
const OneComponent = require('react-some-component')

function AnotherComponent() {
  return rel`<div>foo!</div>`
}

function ComponentUsingExternalComponent(props) {
  return rel`
    <div>
      <${OneComponent} prop1="foo">
        ${props.children}
      </>
      <${AnotherComponent} />
    </div>
  `
}
```
