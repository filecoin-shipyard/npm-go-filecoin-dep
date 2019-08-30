# go-filecoin-dep

> Download [go-filecoin](https://github.com/filecoin-project/go-filecoin/) to your node_modules.

Note: requires Git to be installed.

# Install

```sh
npm install go-filecoin-dep
```

## Usage

This module downloads `go-filecoin` binaries from https://github.com/filecoin-project/go-filecoin/releases into your project.

By default it will download the _latest stable_ go-filecoin version available.

### Overriding the go-filecoin version

You can override the version of go-filecoin that gets downloaded by adding by adding a `go-filecoin.version` field to your `package.json`

```json
"go-filecoin": {
  "version": "^0.4.6"
},
```

Note: The version field accepts semver ranges.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/filecoin-shipyard/js-filecoin-api-client/issues/new) or submit PRs.

## License

The Filecoin Project is dual-licensed under Apache 2.0 and MIT terms:
- Apache License, Version 2.0, ([LICENSE-APACHE](https://github.com/filecoin-shipyard/js-filecoin-api-client/blob/master/LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](https://github.com/filecoin-shipyard/js-filecoin-api-client/blob/master/LICENSE-MIT) or http://opensource.org/licenses/MIT)
