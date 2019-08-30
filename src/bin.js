#!/usr/bin/env node

'use strict'

const install = require('./')

install({
  version: process.argv[2],
  platform: process.argv[3],
  arch: process.argv[4]
}).then(({ version, platform, arch, fileName, installPath }) => {
  console.log(`Installed go-filecoin to ${installPath}`)
  process.exit(0)
}, err => {
  console.error(err)
  process.exit(1)
})
