# paquet-jsx

A JSX parsing mutator for [paquet](https://github.com/helloitsian/paquet).

## Install
```
npm install paquet-jsx
```

## Usage
See [paquet](https://github.com/helloitsian/paquet) for additional config documentation.
```
// paquet.config.js
const PaquetJsx = require('paquet-jsx');

module.exports = {
  // ...config
  mutators: [
    new PaquetJsx(),
  ]
}
```