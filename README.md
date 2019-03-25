# @gatewayjs/cli

gateway.js的命令行工具

## Install

```bash
$ npm i -g @evio/cli # 如果已安装，请忽略
$ cli install @gatewayjs/cli
$ npm i -g pm2
```

## Interface

```bash
Usage: cli [options] [command]

Options:
  -v, --version                     output the version number
  -h, --help                        output usage information

Commands:
  gw:dev [options]                  GateWay.js development mode
  gw:start [options]                GateWay.js production mode
  gw:restart                        GateWay.js production restart mode
  gw:stop                           GateWay.js production stop mode
  gw [options] <path>               create a new gw file by type
  gw:new [options] [project]        create a new gw project or plugin
  gw:setup [options] <plugins...>   setup plugins into project
```

## Add files

```bash
Usage: gw [options] <path>

create a new gw file by type

Options:
  -c, --controller  create a new `Controller` file
  -m, --middleware  create a new `Middleware` file
  -s, --service     create a new `Service` file
  -t, --decorate    create a new `Decorate` file
  -o, --micro       create a new `Micro` file
  -w, --websocket   create a new `Websocket` file
  -h, --help        output usage information
```

## Custom plugin configs

请在项目根目录下添加`gateway.config.json`文件用来配置默认选项。

## Add custom commander

请在项目根目录下添加`commander.js`来自定义功能。