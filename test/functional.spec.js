/* eslint-env mocha */
'use strict'

const Fs = require('fs-extra')
const Os = require('os')
const Path = require('path')
const Assert = require('assert')
const install = require('..')

describe('functional', function () {
  this.timeout(1000 * 60 * 2)

  let projectName, projectPath

  beforeEach(async () => {
    projectName = `project-${Date.now()}`
    projectPath = Path.join(Os.tmpdir(), projectName)
    // console.log(`Test project path: ${projectPath}`)
    await Fs.mkdir(projectPath)
  })

  afterEach(() => Fs.remove(projectPath))

  it('should install filecoin', async () => {
    const filBinPath = Path.join(projectPath, 'filecoin', 'go-filecoin')
    Assert.ok(!(await Fs.pathExists(filBinPath)))
    await install({ installPath: projectPath })
    Assert.ok(await Fs.pathExists(filBinPath))
  })

  it('should throw for missing version', async () => {
    try {
      await install({ version: '0.3.3', installPath: projectPath })
    } catch (err) {
      Assert.strict.equal(err.message, 'No version satisfying \'0.3.3\' available')
      return
    }
    throw new Error('did not throw')
  })
})
