const fs = require('fs');
const path = require('path');
module.exports = async (ctx, options) => {
  const packageFile = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(packageFile)) throw new Error('miss package.json');
  const actions = ['restart', require(packageFile).name];
  await ctx.util.exec('pm2', actions, options.cwd);
}