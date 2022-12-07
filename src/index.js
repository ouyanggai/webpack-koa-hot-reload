"use strict";
exports.__esModule = true;
/*
 * @Author: oygsky
 * @Date: 2022-12-06 16:46:44
 * @LastEditors: oygsky
 * @LastEditTime: 2022-12-06 17:50:42
 * @Description: 唧唧复唧唧
 * @FilePath: \WebpackKoaHotReload\src\index.ts
 */
/**
 * @param {string} command process to run
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
var cp = require("child_process");
var detect_port_1 = require("detect-port");
Promise.resolve().then(function () { return require('colors'); });
var runCommand = function (command, args) {
    return new Promise(function (resolve, reject) {
        var executedCommand = cp.spawn(command, args, {
            stdio: "inherit",
            shell: true
        });
        executedCommand.on("error", function (error) {
            reject(error);
        });
        executedCommand.on("exit", function (code) {
            if (code === 0) {
                resolve();
            }
            else {
                reject();
            }
        });
    });
};
var WebpackKoaHotReload = /** @class */ (function () {
    function WebpackKoaHotReload(options) {
        this.options = options;
    }
    WebpackKoaHotReload.prototype.apply = function (compiler) {
        var _a;
        if (!this.options.main) {
            console.error('******必须提供koa应用入口，请在插件调用时传递*********'.red);
            return;
        }
        var options = {
            port: (_a = this.options) !== null && _a !== void 0 ? _a : 8573
        };
        compiler.hooks.done.tap('WebpackKoaHotReload', function () {
            //编译完成 启动api服务
            (0, detect_port_1["default"])(options.port).then(function (_port) {
                if (options.port === _port) {
                    console.log("\u4F60\u7684koa\u670D\u52A1\u5DF2\u8FD0\u884C\u5728: http://localhost:".concat(options.port).blue.bold);
                    runCommand("nodemon dist/index.js ".concat(options.port), null);
                }
                else {
                    console.log("\u4F60\u7684koa\u670D\u52A1\u5DF2\u8FD0\u884C\u5728: http://localhost:".concat(_port).blue.bold);
                    runCommand("nodemon dist/index.js ".concat(_port), null);
                }
            })["catch"](function (err) {
                console.error(err.red);
            });
        });
    };
    return WebpackKoaHotReload;
}());
exports["default"] = WebpackKoaHotReload;
