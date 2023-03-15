"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
/**
 * Right trim a string
 */
function rtrim(text) {
    return text.replace(/~+$/, "");
}
/**
 * Check if unitless CSS property. See here: https://react-cn.github.io/react/tips/style-props-value-px.html
 */
function isUnitlessProperty(property) {
    return ([
        "animationIterationCount",
        "boxFlex",
        "boxFlexGroup",
        "boxOrdinalGroup",
        "columnCount",
        "fillOpacity",
        "flex",
        "flexGrow",
        "flexPositive",
        "flexShrink",
        "flexNegative",
        "flexOrder",
        "fontWeight",
        "lineClamp",
        "lineHeight",
        "opacity",
        "order",
        "orphans",
        "stopOpacity",
        "strokeDashoffset",
        "strokeOpacity",
        "strokeWidth",
        "tabSize",
        "widows",
        "zIndex",
        "zoom"
    ].indexOf(property.trim()) !== -1);
}
/**
 * Split react style at commas, but not inside stuff like "rgba(a,r,g,b)"
 * Taken from here: https://stackoverflow.com/a/31955570/677910
 * @param text
 */
function splitReact(str) {
    const QUOTES = helpers_1.getQuotes();
    return str.split(",").reduce((accum, curr) => {
        if (accum.isConcatting) {
            accum.soFar[accum.soFar.length - 1] += "," + curr;
        }
        else {
            accum.soFar.push(curr);
        }
        if (curr.split(QUOTES).length % 2 == 0) {
            accum.isConcatting = !accum.isConcatting;
        }
        return accum;
    }, { soFar: [], isConcatting: false }).soFar;
}
/**
 * Convert from react to css style
 */
function reactToCss(text) {
    const [prefix, middle, postfix] = helpers_1.splitPreMiddlePost(text, ",");
    console.log("middle", middle);
    const entries = splitReact(middle); // middle.split(",");
    console.log("entries", entries);
    let converted = entries
        .map(entry => {
        // Remove all quotes
        const globalQuoteRegex = /"|'/g;
        return entry.replace(globalQuoteRegex, "");
    })
        .map(entry => {
        let [left, right] = helpers_1.splitEntry(entry);
        // Add default px. MUST be done before camel case conversion
        if (!isNaN(Number(right)) && !isUnitlessProperty(left)) {
            right = rtrim(right) + "px";
        }
        left = helpers_1.camelCaseToDash(left);
        return helpers_1.joinLine(left, right);
    })
        .join(";");
    // Append ; if last inline style line didn't contain a ,
    if (converted[converted.length - 1] !== ";") {
        converted += ";";
    }
    return helpers_1.joinConditional([prefix, converted, postfix]);
}
exports.reactToCss = reactToCss;
//# sourceMappingURL=react2css.js.map