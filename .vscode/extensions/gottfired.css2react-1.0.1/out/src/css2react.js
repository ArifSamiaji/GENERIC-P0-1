"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
function dashToCamelCase(text) {
    return text.replace(/-([a-z])/g, g => g[1].toUpperCase());
}
/**
 * Convert from css to react style
 */
function cssToReact(text) {
    const [prefix, middle, postfix] = helpers_1.splitPreMiddlePost(text, ";");
    console.log("### middle", middle);
    const QUOTES = helpers_1.getQuotes();
    const entries = middle.split(";");
    const converted = entries
        .map(entry => {
        let [left, right] = helpers_1.splitEntry(entry);
        left = dashToCamelCase(left);
        // Remove px postfix
        if (right.trim().endsWith("px")) {
            right = right.slice(0, -2);
        }
        // Trim and remove quotes (Quotes are only a CSS recommendation)
        right = right.trim();
        right = right.replace(/[\"']/g, "");
        // Add quotes on right if not a number
        if (isNaN(Number(right))) {
            right = ` ${QUOTES}${right}${QUOTES}`;
        }
        return helpers_1.joinLine(left, right);
    })
        .join(",");
    return helpers_1.joinConditional([prefix, converted, postfix]);
}
exports.cssToReact = cssToReact;
//# sourceMappingURL=css2react.js.map