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

  console.log(`Checking for available versions: ${config.repoUrl}`)

  const tags = await remoteGitTags(config.repoUrl)
  const versions = Array.from(tags.keys())
    .map(tag => Semver.valid(tag))
    .filter(v => v !== '9.9.999') // WTF?
    .filter(Boolean)

  console.log(`Found the following available versions: ${versions.join(', ')}`)

  const version = getLatestStable(getVersionsInRange(config.version, versions))

  if (!version) {
    throw new Error(`No version satisfying '${config.version}' available`)
  }

  const platformName = config.platform[0].toUpperCase() + config.platform.slice(1)
  const fileName = `filecoin-${version}-${platformName}.tar.gz`
  const url = `${config.repoUrl}/releases/download/${version}/${fileName}`

  console.log(`Downloading ${url}`)

  await download({ installPath: config.installPath, url })

  return { ...config, version, fileName }
}

function getConfig ({ version, platform, arch, installPath }) {
  const conf = pkgConf.sync('go-filecoin', { cwd: Path.join(process.cwd(), '..') })

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
    ? stables.reduce((latest, v) => Semver.gt(v, latest) ? v : latest, '0.0.0')
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
