"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirectory = exports.pathExists = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
function pathExists(localPath) {
    return promises_1.default
        .access(localPath, fs_1.default.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}
exports.pathExists = pathExists;
const originalFs = getFsModule();
async function isDirectory(filePath) {
    return new Promise((resolve, reject) => {
        originalFs.stat(filePath, (err, statInfo) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(statInfo.isDirectory());
        });
    });
}
exports.isDirectory = isDirectory;
function getFsModule() {
    try {
        // throws an error if module is not found (remote ssh environment)
        require.resolve("original-fs");
        // using original-fs rather than fs to deal with .asar file
        // ref: https://github.com/microsoft/vscode/issues/143393#issuecomment-1047518447
        return require('original-fs');
    }
    catch (e) {
        console.log("original-fs not found, falling back to the default fs module");
        return fs_1.default;
    }
}
//# sourceMappingURL=FsUtils.js.map