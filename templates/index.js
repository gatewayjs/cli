const path = require('path');
module.exports = {
  controller: {
    template: path.resolve(__dirname, './controller.ejs'),
    ext: '.js',
    dir: 'package/controller',
    callback: project => {
      return {
        className: prefix(...project.split('/'))
      }
    }
  },
  middleware: {
    template: path.resolve(__dirname, './middleware.ejs'),
    ext: '.js',
    dir: 'package/middleware'
  },
  service: {
    template: path.resolve(__dirname, './service.ejs'),
    ext: '.js',
    dir: 'package/service',
    callback: project => {
      return {
        className: prefix(...project.split('/'))
      }
    }
  },
  decorate: {
    template: path.resolve(__dirname, './decorate.ejs'),
    ext: '.js',
    dir: 'package/decorate',
    callback: project => {
      return {
        className: prefix(...project.split('/'))
      }
    }
  },
  micro: {
    template: path.resolve(__dirname, './micro.ejs'),
    ext: '.js',
    dir: 'package/micro',
    callback: project => {
      return {
        className: prefix(...project.split('/'))
      }
    }
  },
  websocket: {
    template: path.resolve(__dirname, './websocket.ejs'),
    ext: '.js',
    dir: 'package/websocket',
    callback: project => {
      return {
        className: prefix(...project.split('/'))
      }
    }
  }
}

function prefix(...names) {
  const name = names.join('_').replace(/\//g, '_').replace(/[_-][a-z0-9]/ig, s => s.substring(1).toUpperCase());
  let first = name.charAt(0);
  const next = name.substring(1);
  return first.toUpperCase() + next;
}