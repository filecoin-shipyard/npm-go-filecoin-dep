'use strict'

const goenv = require('go-platform')
const gunzip = require('gunzip-maybe')
const Path = require('path')
const TarFs = require('tar-fs')
const fetch = require('node-fetch')
const pkgConf = require('pkg-conf')
const remoteGitTags = require('remote-git-tags')
const Semver = require('semver')
const { pipeline } = require('stream')

// Only these platforms are currently available
const Platforms = ['darwin', 'linux']
const UnstablePattern = /[a-z+-]/i

const REPO_URL = 'https://github.com/filecoin-project/go-filecoin'

module.exports = async function install (options) {
  const config = getConfig(options || {})

  if (!Platforms.includes(config.platform)) {
    throw new Error(`Platform '${config.platform}' unavailable`)
  }

  console.log(`Checking available versions for ${config.repoUrl}`)

  const tags = Object.keys(await remoteGitTags(config.repoUrl))
    .filter(tag => Semver.valid(tag))

  console.log(`Found the following available versions: ${tags}`)

  const version = getLatestStable(getVersionsInRange(config.version, tags))

  if (!version) {
    throw new Error(`No version satisfying '${config.version}' available`)
  }

  const archName = config.arch[0].toUpperCase() + config.arch.slice(1)
  const fileName = `filecoin-${version}-${archName}.tar.gz`
  const url = `${config.repoUrl}/releases/download/${version}/${fileName}`

  console.log(`Downloading ${url}`)

  await download({ installPath: config.installPath, url })

  return { ...config, version, fileName }
}

function getConfig ({ version, platform, arch, installPath }) {
  let conf = {}
  try {
    conf = pkgConf.sync('go-filecoin', { cwd: Path.join(process.cwd(), '..') })
  } catch (_) {}

  return {
    version: process.env.GO_FILECOIN_DEP_VERSION || version || conf.version || '*',
    platform: process.env.TARGET_OS || platform || conf.platform || goenv.GOOS,
    arch: process.env.TARGET_ARCH || arch || conf.arch || goenv.GOARCH,
    repoUrl: process.env.GO_FILECOIN_DEP_REPO_URL || conf.repoUrl || REPO_URL,
    installPath: installPath ? Path.resolve(installPath) : process.cwd()
  }
}

function getLatestStable (versions) {
  const stables = versions.filter(v => !UnstablePattern.test(v || ''))
  return stables.length
    ? stables.reduce((latest, v) => Semver.gt(v, latest) ? v : latest, '0')
    : null
}

function getVersionsInRange (range, versions) {
  return versions.filter(v => Semver.satisfies(v, range, true))
}

async function download ({ installPath, url }) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Unexpected status: ${res.status}`)
  return unpack({ url, installPath, stream: res.body })
}

function unpack ({ installPath, stream }) {
  return new Promise((resolve, reject) => {
    const cb = err => err ? reject(err) : resolve()
    pipeline(stream, gunzip(), TarFs.extract(installPath), cb)
  })
}
