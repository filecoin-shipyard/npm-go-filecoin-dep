# go-filecoin-dep

## Status

This repository is in a **frozen** state. It is not being maintained or kept in sync with the libraries it depends on. This library was designed for an early version of _go-filecoin_, which is now known as [Venus](https://venus.filecoin.io/). An API client for Lotus can be found at https://github.com/filecoin-shipyard/js-lotus-client-rpc that may be used to build similar functionality. Even though work on this repository has been **shelved**, anyone interested in updating or maintaining this library should express their interest on one Filecoin community conversation mediums: <https://github.com/filecoin-project/community#join-the-community>.

---

[![CircleCI branch](https://img.shields.io/circleci/project/github/filecoin-shipyard/npm-go-filecoin-dep/master.svg)](https://circleci.com/gh/filecoin-shipyard/npm-go-filecoin-dep)
[![dependencies Status](https://david-dm.org/filecoin-shipyard/npm-go-filecoin-dep/status.svg)](https://david-dm.org/filecoin-shipyard/npm-go-filecoin-dep)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

Feel free to dive in! [Open an issue](https://github.com/filecoin-shipyard/npm-go-filecoin-dep/issues/new) or submit PRs.

## License

The Filecoin Project is dual-licensed under Apache 2.0 and MIT terms:
- Apache License, Version 2.0, ([LICENSE-APACHE](https://github.com/filecoin-shipyard/npm-go-filecoin-dep/blob/master/LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](https://github.com/filecoin-shipyard/npm-go-filecoin-dep/blob/master/LICENSE-MIT) or http://opensource.org/licenses/MIT)
