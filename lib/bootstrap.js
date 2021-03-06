const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const corePath = path.resolve(cwd, 'node_modules', '@gatewayjs/gateway');
if (!fs.existsSync(corePath)) throw new Error('failed to resolve module @gatewayjs/gateway, make sure it has been installed.');
const argvOrigin = path.resolve(corePath, './lib/utils/argv.js');
const ArgvCallback = require(argvOrigin);
const configs = ArgvCallback(process.argv.slice(2));
const { GateWay } = require(corePath);
new GateWay(configs).INIT();