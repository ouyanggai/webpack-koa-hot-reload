/*
 * @Author: oygsky
 * @Date: 2022-12-06 16:46:44
 * @LastEditors: oygsky
 * @LastEditTime: 2022-12-07 09:42:56
 * @Description: 唧唧复唧唧
 * @FilePath: \WebpackKoaHotReload\src\index.ts
 */
/**
 * @param {string} command process to run
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
 import * as cp  from 'child_process'
 import { WebpackPluginInstance, Compiler } from 'webpack';
 import detect from 'detect-port';
 import colors from 'colors'

 const runCommand = (command:string, args:any) => {
  return new Promise<void>((resolve, reject) => {
    const executedCommand = cp.spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    executedCommand.on("error", (error) => {
      reject(error);
    });

    executedCommand.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

interface options {
  /**
   * 端口默认8573
   */
  port?:number,
  /**
   * koa入口文件 相对地址
   */
  main:string,
  /**
   * 延迟重启
   */
  delay?:number
}

class WebpackKoaHotReload implements WebpackPluginInstance{
    options: options;
    constructor(options:options){
      this.options = options
    }
    apply(compiler:Compiler){
      const options = {
        port: this.options ?? 8573,
      }
      compiler.hooks.done.tap('WebpackKoaHotReload',()=>{
        if(!this.options.main){
          console.error(colors.red('******必须提供koa应用入口，请在插件调用时传递*********'))
          return 
        }
        //编译完成 启动api服务
        detect(this.options.port).then((_port: number)=>{
          if(this.options.port && this.options.port === _port){
            console.log('你的koa服务已运行在:' + colors.blue.underline(`http://localhost:${this.options.port}`))
            runCommand(`nodemon ${this.options.main} ${options.port}`,null)
          } else {
            console.log('你的koa服务已运行在:' + colors.blue.underline(`http://localhost:${_port}`))
            runCommand(`nodemon ${this.options.main} ${_port}`,null)
          }
        }).catch((err: string)=>{
          console.error(err.red)
        })
      })
    }
}

export default WebpackKoaHotReload