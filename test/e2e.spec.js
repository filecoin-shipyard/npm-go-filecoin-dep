/* eslint-env mocha */
'use strict'

const Fs = require('fs-extra')
const Os = require('os')
const Path = require('path')
const Assert = require('assert')
const execa = require('execa')

describe('e2e', function () {
  this.timeout(1000 * 60 * 2)

  let projectName, projectPath, filBinPath

  function install () {
    const proc = execa('npm', ['install'], { cwd: projectPath })
    // proc.stdout.on('data', d => process.stdout.write(d.toString()))
    // proc.stderr.on('data', d => process.stderr.write(d.toString()))
    return proc
  }

  async function packTarball () {
    const parentDir = Path.join(__dirname, '..')
    const { stdout } = await execa('npm', ['pack', parentDir], { cwd: projectPath })
    return Path.join(projectPath, stdout)
  }

  async function writePkgJson (conf) {
    return Fs.writeFile(
      Path.join(projectPath, 'package.json'),
      JSON.stringify({
        name: projectName,
        version: '1.0.0',
        dependencies: {
          'go-filecoin-dep': await packTarball()
        },
        'go-filecoin': conf
      }, null, 2)
    )
  }

  beforeEach(async () => {
    projectName = `project-${Date.now()}`
    projectPath = Path.join(Os.tmpdir(), projectName)
    filBinPath = Path.join(projectPath, 'node_modules', 'go-filecoin-dep', 'filecoin', 'go-filecoin')
    // console.log(`Test project path: ${projectPath}`)
    await Fs.mkdir(projectPath)
  })

  afterEach(() => Fs.remove(projectPath))

  it('should install filecoin', async () => {
    await writePkgJson()
    Assert.ok(!(await Fs.pathExists(filBinPath)))
    const { stdout } = await install()
    Assert.ok(stdout.includes('Installed go-filecoin'))
    Assert.ok(await Fs.pathExists(filBinPath))
  })

  it('should install 0.2.4 of filecoin from range ^0.2.1', async () => {
    await writePkgJson({ version: '^0.2.1' })
    Assert.ok(!(await Fs.pathExists(filBinPath)))
    const { stdout } = await install()
    Assert.ok(stdout.includes('Installed go-filecoin 0.2.4'))
    Assert.ok(await Fs.pathExists(filBinPath))
  })

  it('should install 0.3.2 of filecoin', async () => {
    await writePkgJson({ version: '0.3.2' })
    Assert.ok(!(await Fs.pathExists(filBinPath)))
    const { stdout } = await install()
    Assert.ok(stdout.includes('Installed go-filecoin 0.3.2'))
    Assert.ok(await Fs.pathExists(filBinPath))
  })
})
