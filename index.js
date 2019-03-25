const fs = require('fs');
const path = require('path');
const resolveUp = require('resolve-up');
module.exports = (program, client) => {
  program
    .command('gw:dev')
    .description('GateWay.js development mode')
    .option('-d, --cwd [cwd]', 'Service startup directory', process.cwd())
    .option('-n, --max [max]', 'Maximum number of service processes started', 0)
    .option('-p, --port [port]', 'Service startup port', 8080)
    .option('-s, --socket', 'Whether to start websocket', false)
    .action(client.require('./lib/development'));
  
  program
    .command('gw:start')
    .description('GateWay.js production mode')
    .option('-d, --cwd [cwd]', 'Service startup directory', process.cwd())
    .option('-n, --max [max]', 'Maximum number of service processes started', 0)
    .option('-p, --port [port]', 'Service startup port', 8080)
    .option('-s, --socket', 'Whether to start websocket', false)
    .action(client.require('./lib/production'));
  
  program
    .command('gw:restart')
    .description('GateWay.js production restart mode')
    .action(client.require('./lib/restart'));
  
  program
    .command('gw:stop')
    .description('GateWay.js production stop mode')
    .action(client.require('./lib/stop'));

  program
    .command('gw <path>')
    .description('create a new gw file by type')
    .option('-c, --controller', 'create a new `Controller` file')
    .option('-m, --middleware', 'create a new `Middleware` file')
    .option('-s, --service', 'create a new `Service` file')
    .option('-t, --decorate', 'create a new `Decorate` file')
    .option('-o, --micro', 'create a new `Micro` file')
    .option('-w, --websocket', 'create a new `Websocket` file')
    .action(client.require('./lib/file'));

  program
    .command('gw:new [project]')
    .description('create a new gw project or plugin')
    .option('-p, --plugin', 'create new plugin mode')
    .action(client.require('./lib/create'));

  program
    .command('gw:setup <plugins...>')
    .description('setup plugins into project')
    .option('-r, --registry <host>', 'which host can been choosed?')
    .action(client.require('./lib/setup'));

  let plugins = [];
  const packageFilePath = path.resolve(process.cwd(), 'package.json');

  if (fs.existsSync(packageFilePath)) {
    const pkg = require(packageFilePath);
    if (pkg.plugins) {
      plugins = Object.keys(pkg.plugins);
    }
  }

  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    const modulePaths = resolveUp(plugin);
    if (!modulePaths.length) continue;
    const modulePath = modulePaths[0];
    const execFile = path.resolve(modulePath, 'commander.js');
    if (!fs.existsSync(execFile)) continue;
    const moduleExports = require(execFile);
    if (typeof moduleExports === 'function' && moduleExports.__IS_CLI_PLUGIN__) {
      moduleExports(program, new client.constructor(modulePath, client.util, client.pkg));
    }
  }
}
module.exports.__IS_CLI_PLUGIN__ = true;