const webExt = require('web-ext').default
const inquirer = require('inquirer')

const pluginName = 'web-ext-plugin'

class WebExtWebpackPlugin {
  constructor (CmdRunParams = {}, CmdRunOptions = {}, PluginOptions = {}) {
    this.logger = console.log.bind(console)
    this.CmdRunParams = { ...CmdRunParams, noReload: true, noInput: true }
    this.CmdRunOptions = { ...CmdRunOptions, shouldExitProgram: false }
    this.verbose = PluginOptions.verbose || false
    this.timeout = PluginOptions.timeout || 5000
  }

  androidSetup () {
    let shouldTimeoutReject = true
    this.androidSetupPromise = new Promise((resolve, reject) => {
      setTimeout(() => shouldTimeoutReject && reject(new Error('No android device found.')), this.timeout)
      webExt.util.logger.consoleStream.write = (...args) => {
        const raw = args[0].msg
        const message = (raw || '').trim().split('\n')
        if (message[0] !== 'Android devices found:') { return this.verbose && this.logger(raw) }
        shouldTimeoutReject = false
        const devices = message.slice(1).map(s => s.substr(3))
        if (devices.length === 1) {
          this.logger('Selecting the only device ' + devices[0])
          this.CmdRunParams.adbDevice = devices[0]
          return resolve()
        }
        inquirer.prompt({ type: 'list', choices: devices, name: 'device', message: 'Select one device to continue' }).then(answer => {
          webExt.util.logger.consoleStream.write = e => this.verbose && this.logger(e)
          this.CmdRunParams.adbDevice = answer.device
        }).then(resolve)
      }
    })
  }

  async androidQueryDevice () {
    if (this.CmdRunParams.adbDevice) return
    await webExt.cmd.run(this.CmdRunParams, this.CmdRunOptions).catch(() => {})
    await this.androidSetupPromise.catch(e => {
      this.error(e)
      throw e
    })
  }

  async watchRun () {
    this.watchMode = true
  }

  async afterEmit () {
    if (!this.watchMode) return

    if (this.runner) {
      this.logger('Webpack emitted, reloading...')
      let reloadOK = await Promise.race([this.runner.reloadAllExtensions().then(() => true).catch(this.error), new Promise(resolve => setTimeout(resolve, this.timeout, false))])
      if (reloadOK) {
        this.logger('Extension reloaded.')
        return
      }
    }

    const runner = await webExt.cmd.run(this.CmdRunParams, this.CmdRunOptions).catch(this.error)
    this.runner = runner

    // Fix web-ext's bad
    process.stdin.setRawMode(false)

    runner.registerCleanup(() => {
      this.runner = null
    })
  }

  apply (compiler) {
    const logger = compiler.getInfrastructureLogger(pluginName)
    this.logger = logger.info.bind(logger)
    this.error = logger.error.bind(logger)

    if (this.CmdRunParams.target === 'firefox-android' && !this.CmdRunParams.adbDevice) {
      this.androidSetup.bind(this)()
      this.androidQueryDeviceResult = this.androidQueryDevice.bind(this)()
      compiler.hooks.beforeCompile.tapPromise({ name: pluginName }, () => this.androidQueryDeviceResult)
    }

    compiler.hooks.done.tapPromise({ name: pluginName }, this.afterEmit.bind(this))
    compiler.hooks.watchRun.tapPromise({ name: pluginName }, this.watchRun.bind(this))
  }
}

module.exports = WebExtWebpackPlugin
