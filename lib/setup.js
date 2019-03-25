const fs = require('fs');
const path = require('path');
const globby = require('globby');
const fse = require('fs-extra');
const { Signale } = require('signale');
module.exports = async (ctx, plugins, options) => {
  const pluginListFile = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(pluginListFile)) throw new Error('miss package.json');
  let name = 'npm';
  const actions = plugins.slice(0);
  actions.unshift('install');
  if (options.registry) {
    if (/^http(s)?\:\/\//i.test(options.registry)) {
      actions.push('--registry=' + options.registry);
    } else {
      name = options.registry;
    }
  }

  await ctx.util.exec(name, actions, process.cwd());
  ctx.catch(async () => {
    const _actions = plugins.slice(0);
    _actions.unshift('uninstall');
    await ctx.util.exec('npm', _actions, process.cwd());
  });

  const _pkg = JSON.parse(fs.readFileSync(pluginListFile, 'utf8'));
  if (!_pkg.gateway) _pkg.gateway = {};
  if (!_pkg.gateway.dependencies) _pkg.gateway.dependencies = {};
  const PluginListExports = _pkg.plugins || {};
  const pluginConfigFiles = globby.sync(['config/plugin.*.json'], { cwd: process.cwd() }).map(file => path.resolve(process.cwd(), file));
  const pluginConfigExports = pluginConfigFiles.map(file => require(file));

  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    const pluginPath = path.resolve(process.cwd(), 'node_modules', plugin, 'gateway.config.json');
    if (!PluginListExports[plugin]) {
      PluginListExports[plugin] = {
        enable: true
      }
    }
    if (fs.existsSync(pluginPath)) {
      const pluginExports = require(pluginPath);
      pluginConfigExports.forEach(config => {
        if (!config[plugin]) {
          config[plugin] = pluginExports;
        }
      });
    }
    _pkg.gateway.dependencies[plugin] = _pkg.dependencies[plugin];
  }
  _pkg.plugins = PluginListExports;

  // fse.outputFileSync(output, code, 'utf8')
  fse.outputFileSync(pluginListFile, JSON.stringify(_pkg, null, 2), 'utf8');
  pluginConfigFiles.forEach((file, index) => {
    fse.outputFileSync(file, JSON.stringify(pluginConfigExports[index], null, 2), 'utf8');
  });
  const interactive = new Signale();
  interactive.success({
    message: `OK, add plugins success!`,
    suffix: '(+' + plugins.length + ')'
  });
}