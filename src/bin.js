#!/usr/bin/env node

'use strict'

const install = require('./')
const argv = process.argv

install({ version: argv[2], platform: argv[3], arch: argv[4] })
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
