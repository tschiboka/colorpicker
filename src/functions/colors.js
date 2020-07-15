/* Function input can be any color or color code or text eg: red, #ff0000ff, rgba(255, 0, 0, 0.5).
 * The return will be a color object with all the possible variations of the given color. 
 * Additional informations are available eg valid, websafe, and code obj. (see below) */
export function getColorObj(colorStr) {
    // color type functions return a flag in case of a matching color string
    const isRgb = str => /^rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/g.test(str)
        ? str.match(/\d*/g).filter(m => !!m).map(Number).every(d => d >= 0 && d <= 255)
        : false;
    const isRgba = str => {
        if (!/^rgba\(\d{1,3},\s?\d{1,3},\s?\d{1,3},\s?\d\.?\d*\)$/g.test(str)) return false;
        else {
            const digits = str.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
            const alpha = Number(digits[3]);
            return alpha >= 0 && alpha <= 1 && digits.every(d => d >= 0 && d <= 255);
        }
    }
    const isHex = str => /^((#[A-F\d]{8})|(#[A-F\d]{6})|(#[A-F\d]{3}))$/gi.test(str);
    const isHsl = str => {
        if (!/^hsl\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/g.test(str)) return false;
        else {
            const digits = str.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
            const h = digits[0] >= 0 && digits[0] <= 360;
            const s = digits[1] >= 0 && digits[1] <= 100;
            const l = digits[2] >= 0 && digits[2] <= 100;
            return h && s && l;
        }
    }
    const isHsla = str => {
        if (!/^hsla\(\d{1,3},\s?\d{1,3},\s?\d{1,3},\s?\d\.?\d*\)$/g.test(str)) return false;
        else {
            const digits = str.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
            const h = digits[0] >= 0 && digits[0] <= 360;
            const s = digits[1] >= 0 && digits[1] <= 100;
            const l = digits[2] >= 0 && digits[2] <= 100;
            const a = digits[3] >= 0 && digits[3] <= 1;
            return h && s && l && a;
        }
    }
    const isWebSafe = hex => /^((00)|(33)|(66)|(99)|(CC)|(FF)){3}$/gi.test(hex);

    // get color type
    let r, g, b, hex, h, s, l, a, name, safe = undefined;
    const colorType = ["rgb", "rgba", "hex", "hsl", "hsla", "invalid"][[isRgb(colorStr), isRgba(colorStr), isHex(colorStr), isHsl(colorStr.replace(/%/g, "")), isHsla(colorStr.replace(/%/g, "")), true].findIndex(e => !!e)];

    // get color values (r, g, b, h, s, l, hex) for all the possible input variations
    switch (colorType) {
        case "rgb": {
            const digits = colorStr.match(/\d*/g).filter(m => !!m).map(Number);
            const hsl = rgbToHsl(...digits);

            r = digits[0]; g = digits[1]; b = digits[2];
            hex = rgbToHex(...digits);
            h = hsl[0]; s = hsl[1]; l = hsl[2];
            break;
        }
        case "rgba": {
            const digits = colorStr.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
            const hsl = rgbToHsl(...digits);

            r = digits[0]; g = digits[1]; b = digits[2]; a = digits[3];
            hex = rgbToHex(...digits);
            h = hsl[0]; s = hsl[1]; l = hsl[2];
            break;
        }
        case "hex": {
            const rgba = hexToRgb(colorStr);
            r = rgba[0]; g = rgba[1]; b = rgba[2]; a = rgba[3];
            const hsl = rgbToHsl(r, g, b);
            h = hsl[0]; s = hsl[1]; l = hsl[2];
            hex = rgbToHex(r, g, b);
            break;
        }
        case "hsl": {
            const digits = colorStr.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
            const rgb = hslToRgb(...digits);
            r = rgb[0]; g = rgb[1]; b = rgb[2];
            h = digits[0]; s = digits[1]; l = digits[2];
            hex = rgbToHex(r, g, b);
            break;
        }
        case "hsla": {
            const digits = colorStr.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
            const rgb = hslToRgb(...digits);
            r = rgb[0]; g = rgb[1]; b = rgb[2];
            h = digits[0]; s = digits[1]; l = digits[2]; a = digits[3];
            hex = rgbToHex(r, g, b);
            break;
        }
        default: { throw Error("Invalid color : " + colorStr); }
    }

    // get alpha, websafe, color name info for all valid inputs
    if (colorType !== "invalid") {
        a = (a === undefined) ? 1 : a; // a can be 0 which is falsy
        safe = isWebSafe(hex);
        name = require("../constants/color_templates/cssColors.json")["#" + hex];
    }

    return ({
        valid: colorType !== "invalid",             // if color is invalid the rest of obj props are undefined
        websafe: safe,                              // flag if color is a web safe 
        rgb: { r: r, g: g, b: b },                  // object format for rgb
        hex: hex,                                   // hex values, no hashtag!
        hsl: { h: h, s: s, l: l },                  // hsl obj values
        alpha: Math.round(a * 100),                 // transparency is given as percentage eg 57 rather than a float .57 (for easier text input manipulation)
        name: name,                                 // the css name of the color or undefined
        code: colorType !== "invalid" ? {           // code object has all the code formats of the color
            rgb: `rgb(${r}, ${g}, ${b})`,           // rgb(r, g, b)
            rgba: `rgba(${r}, ${g}, ${b}, ${a})`,   // rgba(r, g, b, a) a 0 - 1
            hex: `#${hex}`,                         // # + 6 digit format
            hsl: `hsl(${h}, ${s}%, ${l}%)`,         // hsl(0 - 360, 0 - 100%, 0 - 100%)
            hsla: `hsla(${h}, ${s}%, ${l}%, ${a})`, // hsla(h, s, l, a) a 0 - 1
            name: name                              // the css name of the color or undefined
        } : undefined                               // invalid color results code: undefined
    });
}




// Series of color format functions

export function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;  // Expand shorthand form "03F" to full form "0033FF"
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    return hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i)
        .map(h => parseInt(h, 16))
        .map((n, i) => i !== 4 ? n : Math.round((n / 255) * 100) / 100) // get % if alpha present
        .filter(n => !isNaN(n)); // first elem isNan
}



export function rgbToHex(r, g, b) {
    const decToHex = (n, hex = n.toString(16)) => hex.length === 1 ? "0" + hex : hex;
    return decToHex(r) + decToHex(g) + decToHex(b);
}



export function rgbToHexA(r, g, b, a) {
    const decToHex = (n, hex = n.toString(16)) => hex.length === 1 ? "0" + hex : hex;
    return decToHex(r) + decToHex(g) + decToHex(b) + (a && decToHex(a));
}




export function rgbToHsl(red, green, blue) {
    const r = red / 255, g = green / 255, b = blue / 255;
    const min = Math.min(r, g, b), max = Math.max(r, g, b);
    const lum = (min + max) / 2;
    let hue, sat, dif;

    if (min === max) {
        hue = 0;
        sat = 0;
    } else {
        dif = max - min;
        sat = lum > 0.5 ? dif / (2 - max - min) : dif / (max + min);
        switch (max) {
            case r: { hue = (g - b) / dif; break; }
            case g: { hue = 2 + ((b - r) / dif); break; }
            case b: { hue = 4 + ((r - g) / dif); break; }
            default: { }
        }
        hue *= 60;
        if (hue < 0) hue += 360;
    }
    return [hue, sat * 100, lum * 100].map(n => Math.round(n));
}



export function hslToRgb(h, s, l) {
    let r, g, b, m, c, x;

    if (!isFinite(h)) h = 0; if (!isFinite(s)) s = 0; if (!isFinite(l)) l = 0;

    h /= 60;
    if (h < 0) h = 6 - (-h % 6);
    h %= 6;

    s = Math.max(0, Math.min(1, s / 100));
    l = Math.max(0, Math.min(1, l / 100));

    c = (1 - Math.abs((2 * l) - 1)) * s;
    x = c * (1 - Math.abs((h % 2) - 1));

    if (h < 1) { r = c; g = x; b = 0; }
    else if (h < 2) { r = x; g = c; b = 0; }
    else if (h < 3) { r = 0; g = c; b = x; }
    else if (h < 4) { r = 0; g = x; b = c; }
    else if (h < 5) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    m = l - c / 2;
    r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255);
    return [r, g, b];
}



// Function returns with hex shorthand eg.: FFAA33 -> FA3
// If there is no shorthand return original value
export function hexShortHand(hex) {
    const hexPairs = hex.match(/\w{2}/gi);
    const allPairMatches = hexPairs.reduce((prev, curr) => prev ? curr[0] === curr[1] : false, true);

    return allPairMatches ? (hex[0] + hex[2] + hex[4]) : hex;
}