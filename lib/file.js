const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const ejs = require('ejs');
const { Signale } = require('signale');
const templates = require('../templates');
module.exports = async (ctx, project, options) => {
  const packageFile = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(packageFile)) throw new Error('miss package.json');
  const interactive = new Signale();
  const fileTemplates = [];
  ['controller', 'middleware', 'service', 'decorate', 'micro', 'websocket'].forEach(key => {
    if (options[key]) fileTemplates.push(templates[key]);
  });
  let count = 0;
  for (let i = 0; i < fileTemplates.length; i++) {
    const item = fileTemplates[i];
    const output = path.resolve(process.cwd(), item.dir, project + item.ext);
    const data = item.callback ? item.callback(project) : {};
    const result = await render(ctx, item.template, output, data);
    if (result) {
      count++;
    }
  }
  interactive.success({
    message: `OK, add file success!`,
    suffix: '(+' + count + ')'
  });
}

async function render(ctx, template, output, data = {}) {
  if (!fs.existsSync(template)) throw new Error('can not find template:' + template);
  const code = await new Promise((resolve, reject) => {
    ejs.renderFile(template, data, function(err, str){
      if (err) return reject(err);
      resolve(str);
    });
  });
  if (!fs.existsSync(output)) {
    fse.outputFileSync(output, code, 'utf8');
    ctx.catch(() => fs.unlinkSync(output));
    return true;
  }
}