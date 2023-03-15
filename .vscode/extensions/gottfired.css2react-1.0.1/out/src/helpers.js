"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
// get single ord double quotes from settings
function getQuotes() {
    const config = vscode.workspace.getConfiguration("css2react");
    return config.singleQuotes ? "'" : '"';
}
exports.getQuotes = getQuotes;
/**
 * Split selection into part before the actual style entries, the style entries
 * and the stuff after. So users don't have to be that specific with their selection
 */
function splitPreMiddlePost(text, separator) {
    const lines = text.split(/\r?\n/);
    const prefixLines = [];
    const middleLines = [];
    const postfixLines = [];
    lines.forEach((line, index) => {
        if (middleLines.length === 0) {
            // A style line must contain : and , or ; except for the last one in inline styles
            if (line.indexOf(":") < 0 ||
                (index < line.length - 1 &&
                    line.indexOf(separator) < 0 &&
                    separator === ",")) {
                prefixLines.push(line);
            }
            else {
                middleLines.push(line);
            }
        }
        else if (postfixLines.length === 0) {
            // Line contains colon or is only whitespace -> add to middle
            if (line.indexOf(":") >= 0 || line.trim() === "") {
                middleLines.push(line);
            }
            else {
                postfixLines.push(line);
            }
        }
        else {
            postfixLines.push(line);
        }
    });
    const prefix = prefixLines.join("\n");
    const middle = middleLines.join("\n");
    const postfix = postfixLines.join("\n");
    // console.log("prefix", prefix);
    // console.log("middle", middle);
    // console.log("postfix", postfix);
    return [prefix, middle, postfix];
}
exports.splitPreMiddlePost = splitPreMiddlePost;
/**
 * Split a line like "minWidth: bla ? 10 : 20" into
 * ["minWidth", "bla ? 10 : 20"]
 */
function splitEntry(entry) {
    let [left, ...rest] = entry.split(":");
    let right = rest.join(":");
    return [left, right];
}
exports.splitEntry = splitEntry;
/**
 * Join left and right to final style entry
 */
function joinLine(left, right) {
    if (left.trim().length > 0 && right.trim().length > 0) {
        return left + ":" + right;
    }
    else {
        return "";
    }
}
exports.joinLine = joinLine;
function joinConditional(strings) {
    const result = strings.filter(s => s != null && s.length > 0);
    return result.join("\n");
}
exports.joinConditional = joinConditional;
function camelCaseToDash(text) {
    return text.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
exports.camelCaseToDash = camelCaseToDash;
//# sourceMappingURL=helpers.js.map