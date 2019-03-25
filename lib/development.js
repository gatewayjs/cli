const fs = require('fs');
const path = require('path');
const bootstrap = path.resolve(__dirname, './bootstrap.js');
module.exports = async (ctx, options) => {
  const packageFile = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(packageFile)) throw new Error('miss package.json');
  const actions = [bootstrap];
  if (options.cwd) actions.push('--cwd=' + options.cwd);
  if (options.max) actions.push('--max=' + options.max);
  if (options.port) actions.push('--port=' + options.port);
  if (options.socket) actions.push('--socket');
  await ctx.util.exec('node', actions, options.cwd);
}