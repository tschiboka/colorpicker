import React, { Component } from 'react';
import "./ColorPicker.scss";
import transparentCheckerdBg from "./images/transparent_checkered_bg.png";
import checkeredRect from "./images/checkered_rect.png";
import sliderThumb from "./images/hue_slider_thumb.png";



export default class ColorPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            browser: { // gradients won't work without sniffing the browser
                agent: navigator.userAgent.match(/(Chrome|Firefox|MSIE|Egde|Safari|Opera)/g)[0],
                prefix: `-${(Array.prototype.slice.call(window.getComputedStyle(document.documentElement, '')).join('').match(/-(moz|webkit|ms)-/))[1]}-`
            },
            x: this.getPositionXY("X"),
            y: this.getPositionXY("Y"),
            color: this.getColorObj(this.props.color || "rgb(255, 0, 0)"),
            originalcolor: this.getColorObj(this.props.color || "rgb(255, 0, 0)"),
            hueSliderMouseDown: false,
            alphaSliderMouseDown: false,
            colorPaletteMouseDown: false,
            sliderThumbsMinOffset: undefined,
            hueCanvasColorSequenceDrawn: false, // the hue that's color will picked need to be drawn when component is visible (first mouseover event)
            colorPaletteDrawn: false, // same goes for color palette (as soon as component is visible)
        };
    }



    componentDidMount() {
        window.addEventListener("resize", () => {
            this.setState({
                ...this.state,
                sliderThumbsMinOffset: document.getElementById((this.props.id || "") + "-hue-color-points").getBoundingClientRect().left,
                x: this.getPositionXY("X"),
                y: this.getPositionXY("Y"),
            });
        });
    }



    componentDidUpdate(prevProps) {
        if (!this.state.colorPaletteDrawn && document.getElementById((this.props.id || "") + "-color-palette")) {
            if (!prevProps.visible) { this.primeDOMElements(); }
            this.setState({
                ...this.state,
                x: this.getPositionXY("X"),
                y: this.getPositionXY("Y"),
                colorPaletteDrawn: true,
                colorPaletteBox: document.getElementById((this.props.id || "") + "-color-palette-box"),
                colorPalette: document.getElementById((this.props.id || "") + "-color-palette"),
                sliderThumbsMinOffset: document.getElementById((this.props.id || "") + "-hue-color-points").getBoundingClientRect().left,
            },
                () => this.drawColorPaletteCanvas());
        }
    }



    // set the components x and y postions, and override props in case of overflow.
    getPositionXY(axis) {
        let x = this.props.X || this.props.x || 0; // props x, y can be capitalised
        let y = this.props.Y || this.props.y || 0;

        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const component = document.getElementById(this.props.id);
        const componentWidth = component ? component.getBoundingClientRect().width : 500;
        const componentHeight = component ? component.getBoundingClientRect().height : 350;
        const componentLeft = component ? component.getBoundingClientRect().left : x;
        const componentBottom = component ? component.getBoundingClientRect().bottom : x;

        if (viewportWidth - (componentWidth + componentLeft) <= 0) x = Math.floor(viewportWidth - componentWidth);
        if (viewportHeight - (componentHeight + componentBottom <= 0)) y = Math.floor(viewportHeight - componentHeight);

        if (!axis) return [x, y];
        if (axis === "x" || axis === "X") return x;
        if (axis === "y" || axis === "Y") return y;
    }



    // when react componentDidMount is called none of the elems are in the DOM
    // getting elements multiple times in mouse events comes at the expense of performance
    // set state when component is mounted and rendered, first mousemove seems to be a smooth way to prime state without slowing performance 
    primeDOMElements() {
        this.setState({
            ...this.state,
            alphaSlider: document.getElementById((this.props.id || "") + "-alpha"),
            hueSlider: document.getElementById((this.props.id || "") + "-hue"),
            alphaSliderThumb: document.getElementById((this.props.id || "") + "-alpha__thumb"),
            hueSliderThumb: document.getElementById((this.props.id || "") + "-hue__thumb"),
            sliderThumbsMinOffset: document.getElementById((this.props.id || "") + "-hue-color-points").getBoundingClientRect().left,
            hueColorPoints: document.getElementById((this.props.id || "") + "-hue-color-points"),
            paletteCursor: document.getElementById((this.props.id || "") + "-color-palette-cursor"),
        }, () => { this.drawHueCanvas(); });
    }



    drawHueCanvas() {
        const hueSlider = this.state.hueSlider;
        const hueRect = hueSlider.getBoundingClientRect();
        const [width, height] = [hueRect.width, hueRect.height];
        const hueCanvas = this.state.hueColorPoints;
        const ctx = hueCanvas.getContext("2d");

        hueCanvas.width = width;
        hueCanvas.height = height;

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        const colorStops = [0, 0.005, 0.17, 0.33, 0.5, 0.67, 0.83, 0.995, 1];
        const colors = ["FF0000", "FF0000", "FFFF00", "00FF00", "00FFFF", "0000FF", "FF00FF", "FF0000", "FF0000"]; // widen a bit the red edges, max was rgba(255, 1, 0, 255) 
        colorStops.forEach((stop, i) => gradient.addColorStop(stop, `#${colors[i]}`));

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        this.setState({ ...this.state, hueCanvasColorSequenceDrawn: true });
    }


    /* Function draws a canvas rectangle which will be the colorpicker palette.
     * First gradient is vertical grayscale from white top to black bottom.
     * The second is a horizontal gradient from left transparent to right current hue. 
     * The current hue is taken from the states color object. */
    drawColorPaletteCanvas() {
        const box = this.state.colorPaletteBox;
        const rect = box.getBoundingClientRect();
        const [width, height] = [rect.width, rect.height];
        const palette = this.state.colorPalette;
        const ctx = palette.getContext("2d");

        const hue = this.state.color.hsl.h;

        palette.width = width;
        palette.height = height;

        const gradGreyScale = ctx.createLinearGradient(0, 0, 0, height);
        gradGreyScale.addColorStop(0, "white");
        gradGreyScale.addColorStop(0.01, "white"); // easier to pick up clear colors by the edges
        gradGreyScale.addColorStop(0.99, "black"); // see above
        gradGreyScale.addColorStop(1, "black");

        const gradHueOpacity = ctx.createLinearGradient(0, 0, width, 0);
        gradHueOpacity.addColorStop(0, `hsla(${Math.floor(hue)},100%,50%,0)`);
        gradHueOpacity.addColorStop(0.01, `hsla(${Math.floor(hue)},100%,50%,0)`); // see above
        gradHueOpacity.addColorStop(0.99, `hsla(${Math.floor(hue)},100%,50%,1)`); // see above
        gradHueOpacity.addColorStop(1, `hsla(${Math.floor(hue)},100%,50%,1)`);

        ctx.fillStyle = gradGreyScale;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = gradHueOpacity;
        ctx.globalCompositeOperation = "multiply";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
    }



    // Hue and alpha sliders behave the same way on mouse up/down, therefore they share a common handle function.
    handleSliderThumbMouseUpDown(e, mouseIsDown) {
        const sliderType = e.target.id.replace(/.*-hue__thumb/g, "hue").replace(/.*-alpha__thumb/g, "alpha");
        const touchPoint = e.clientX - document.getElementById(e.target.id).getBoundingClientRect().x; // where the mouse lands on the thumb

        if (sliderType === "hue") this.setState({ ...this.state, hueSliderMouseDown: mouseIsDown, sliderTouchPoint: mouseIsDown ? touchPoint : 0, sliderEventFrom: "thumb" });
        if (sliderType === "alpha") this.setState({ ...this.state, alphaSliderMouseDown: mouseIsDown, sliderTouchPoint: mouseIsDown ? touchPoint : 0, sliderEventFrom: "thumb" });
    }



    /* Sliders can be set by clicking on them, it is not neccesary to use the thumbs.
     * Only mousedown event is written, the mouseup is coming from the body of the colorpicker */
    handleSliderMouseDown(e) {
        e.persist(); // because synt. event is reused in async setState, it would be nullified by React, thus e.target is not available in callback

        const sliderType = e.target.id.replace(/.*-hue-color-points/g, "hue").replace(/.*-alpha/g, "alpha");
        const touchPoint = e.clientX - document.getElementById(e.target.id).getBoundingClientRect().x;

        if (sliderType === "hue") this.setState({ ...this.state, hueSliderMouseDown: true, sliderTouchPoint: touchPoint, sliderEventFrom: "slider" }
            , () => this.handleColorPickerMouseMove(e));
        if (sliderType === "alpha") this.setState({ ...this.state, alphaSliderMouseDown: true, sliderTouchPoint: touchPoint, sliderEventFrom: "slider" }
            , () => this.handleColorPickerMouseMove(e));
    }



    /* The mousemove event is coming from the color pickers body in order to make sliding smoother.
    * Mouse down must be on sliders thumb or the slider itself, mouse move has to be in the range of the colorpicker. */
    handleColorPickerMouseMove(e) {
        if (!this.state.sliderThumbsMinOffset) this.primeDOMElements(); // the first mousemove sets all neccessary div in comp state

        const sliderType = this.state.hueSliderMouseDown ? "hue" : this.state.alphaSliderMouseDown ? "alpha" : "";

        if (sliderType) {
            // set the new position of slider thumb
            const maxX = this.state.alphaSlider.getBoundingClientRect().width; // hue & alpha has same width
            const target = sliderType === "hue" ? this.state.hueSliderThumb : this.state.alphaSliderThumb;
            let diffX = 0;

            if (this.state.sliderEventFrom === "thumb") diffX = e.clientX - this.state.sliderThumbsMinOffset - this.state.sliderTouchPoint + 11;
            if (this.state.sliderEventFrom === "slider") diffX = e.clientX - this.state.sliderThumbsMinOffset;

            if (diffX < 0) diffX = 0;
            if (diffX > maxX - 1) diffX = maxX - 1;

            target.style.left = diffX + "px";

            // react on hue or alpha changes
            if (sliderType === "hue") {
                const ctx = this.state.hueColorPoints.getContext("2d");
                const [r, g, b] = [...ctx.getImageData(diffX, 3, 1, 1).data];

                this.setState({ ...this.state, color: this.getColorObj(`rgba(${r}, ${g}, ${b}, ${(this.state.color.alpha / 100).toFixed(2)})`) }, () => {
                    this.drawColorPaletteCanvas()
                    const [r, g, b] = [...this.getColorUnderPaletteCursor()];
                    this.setState({ ...this.state, color: this.getColorObj(`rgba(${r}, ${g}, ${b}, ${(this.state.color.alpha / 100).toFixed(2)})`) });
                });
            }
            else {
                const alpha = 100 - Math.round((diffX / maxX) * 100);
                const colorObj = this.getColorObj(`rgba(${this.state.color.rgb.r}, ${this.state.color.rgb.g}, ${this.state.color.rgb.b}, ${(alpha / 100).toFixed(2)})`);
                this.setState({ ...this.state, color: colorObj });
            }
        }
    }



    // Function can be invoked from mousemove on palette or from the hue slider.
    getColorUnderPaletteCursor(x, y, callback) {
        x = x || Number(window.getComputedStyle(this.state.paletteCursor).left.match(/-?\d*\.?\d*/g)[0]) + 11;
        y = y || Number(window.getComputedStyle(this.state.paletteCursor).top.match(/-?\d*\.?\d*/g)[0]) + 11;

        const ctx = this.state.colorPalette.getContext("2d");
        const rgb = [...ctx.getImageData(x, y, 1, 1).data].map(n => Math.round(n));

        rgb.pop(); // get rid of alpha

        typeof callback === 'function' && callback(rgb);

        return rgb;
    }



    handleColorPaletteOnMouseMove(e) {
        // find out mouse cursor position
        const target = this.state.colorPalette;
        const rect = target.getBoundingClientRect();
        const [maxX, maxY] = [rect.width, rect.height];
        const [left, top] = [rect.left, rect.top];
        let [x, y] = [e.clientX - left, e.clientY - top];
        x = x < 1 ? 1 : x > maxX ? maxX : x;
        y = y < 1 ? 1 : y > maxY ? maxY : y;

        // set custom cursor position
        const cursor = this.state.paletteCursor;
        const curRect = cursor.getBoundingClientRect();
        const [curWidth, curHeight] = [curRect.width, curRect.height];
        cursor.style.left = (x - curWidth / 2) + "px";
        cursor.style.top = (y - curHeight / 2) + "px";

        // set the state with a new color
        const [r, g, b] = [...this.getColorUnderPaletteCursor(x, y)];
        this.setState({ ...this.state, color: this.getColorObj(`rgba(${r}, ${g}, ${b}, ${(this.state.color.alpha / 100).toFixed(2)})`) });
    }



    /* Function input can be any color or color code or text eg: red, #ff0000ff, rgba(255, 0, 0, 0.5).
     * The return will be a color object with all the possible variations of the given color. 
     * Additional informations are available eg valid, websafe, and code obj. (see below) */
    getColorObj(colorStr) {
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
        const colorType = ["rgb", "rgba", "hex", "hsl", "hsla", "invalid"][[isRgb(colorStr), isRgba(colorStr), isHex(colorStr), isHsl(colorStr), isHsla(colorStr), true].findIndex(e => !!e)];

        // get color values (r, g, b, h, s, l, hex) for all the possible input variations
        switch (colorType) {
            case "rgb": {
                const digits = colorStr.match(/\d*/g).filter(m => !!m).map(Number);
                const hsl = this.rgbToHsl(...digits);

                r = digits[0]; g = digits[1]; b = digits[2];
                hex = this.rgbToHex(...digits);
                h = hsl[0]; s = hsl[1]; l = hsl[2];
                break;
            }
            case "rgba": {
                const digits = colorStr.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
                const hsl = this.rgbToHsl(...digits);

                r = digits[0]; g = digits[1]; b = digits[2]; a = digits[3];
                hex = this.rgbToHex(...digits);
                h = hsl[0]; s = hsl[1]; l = hsl[2];
                break;
            }
            case "hex": {
                const rgba = this.hexToRgb(colorStr);
                r = rgba[0]; g = rgba[1]; b = rgba[2]; a = rgba[3];
                const hsl = this.rgbToHsl(r, g, b);
                h = hsl[0]; s = hsl[1]; l = hsl[2];
                hex = this.rgbToHex(r, g, b);
                break;
            }
            case "hsl": {
                const digits = colorStr.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
                const rgb = this.hslToRgb(...digits);
                r = rgb[0]; g = rgb[1]; b = rgb[2];
                h = digits[0]; s = digits[1]; l = digits[2];
                hex = this.rgbToHex(r, g, b);
                break;
            }
            case "hsla": {
                const digits = colorStr.match(/(\d\.\d*)|(\d*)/g).filter(m => !!m).map(Number);
                const rgb = this.hslToRgb(...digits);
                r = rgb[0]; g = rgb[1]; b = rgb[2];
                h = digits[0]; s = digits[1]; l = digits[2]; a = digits[3];
                hex = this.rgbToHex(r, g, b);
                break;
            }
            default: { throw Error("Invalid color : " + colorStr); }
        }

        // get alpha, websafe, color name info for all valid inputs
        if (colorType !== "invalid") {
            a = (a === undefined) ? 1 : a; // a can be 0 which is falsy
            safe = isWebSafe(hex);
            name = require("./json/cssColors.json")["#" + hex];
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
    hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;  // Expand shorthand form "03F" to full form "0033FF"
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        return hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i)
            .map(h => parseInt(h, 16))
            .map((n, i) => i !== 4 ? n : Math.round((n / 255) * 100) / 100) // get % if alpha present
            .filter(n => !isNaN(n)); // first elem isNan
    }



    rgbToHex(r, g, b) {
        const decToHex = (n, hex = n.toString(16)) => hex.length === 1 ? "0" + hex : hex;
        return decToHex(r) + decToHex(g) + decToHex(b);
    }



    rgbToHsl(red, green, blue) {
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



    hslToRgb(h, s, l) {
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



    findAndSetColorByInput(type, values) {
        const updatePaletteCursorPosition = () => {
            // find and set appropriate position on palette
            const palette = this.state.colorPalette;
            const rect = palette.getBoundingClientRect();
            const [width, height] = [Math.floor(rect.width), Math.floor(rect.height)];
            const paletteCtx = palette.getContext("2d");
            const imgData = paletteCtx.getImageData(1, 1, width, height).data;
            let pixelRgb = [], px = 0, closest = { diff: 766, px: -1 };
            const [red, green, blue] = [this.state.color.rgb.r, this.state.color.rgb.g, this.state.color.rgb.b];

            // find the pixel with the smallest color difference
            for (let i = 0; i <= imgData.length; i++) {
                if (i % 4 !== 3) pixelRgb.push(imgData[i]);
                else {
                    px++;
                    const dif = (n1, n2) => Math.abs(n1 - n2);
                    const totDiff = dif(red, pixelRgb[0]) + dif(green, pixelRgb[1], dif(blue, pixelRgb[2]));
                    if (totDiff === 0) { closest = { diff: totDiff, px: px }; break; }
                    if (totDiff < closest.diff) closest = { diff: totDiff, px: px };
                    pixelRgb = [];
                }
            }

            // place cursor
            const x = closest.px % width, y = Math.round(closest.px / width);
            const thumb = this.state.paletteCursor;
            thumb.style.left = x - 11 + "px";
            thumb.style.top = y - 11 + "px";
        }

        const resetTextInputs = () => { this.setState({ ...this.state, input_r: undefined, input_g: undefined, input_b: undefined, input_h: undefined, input_s: undefined, input_l: undefined, input_hex: undefined }); }

        const adjustHueSlider = () => {
            // set hue slider to the corresponding hue
            const hueSlider = this.state.hueSlider;
            const width = Math.floor(hueSlider.getBoundingClientRect().width);
            const hueCanvas = this.state.hueColorPoints;
            const hueCtx = hueCanvas.getContext("2d");
            let newSliderX = 0;

            for (let i = 0; i < width; i++) {
                const [r, g, b] = [...hueCtx.getImageData(i, 3, 1, 1).data];
                const pixelHue = this.rgbToHsl(r, g, b)[0]

                if (pixelHue >= hue) { newSliderX = i; break; }
            }

            const sliderThumb = this.state.hueSliderThumb;
            sliderThumb.style.left = newSliderX + "px";
        }

        if (type !== "hex") values = values.map(Number);
        let hue, rgb, newColorObj;

        switch (type) {
            case "h": {
                hue = values[0];
                rgb = this.hslToRgb(...values);
                newColorObj = this.getColorObj("rgb(" + rgb.join(",") + ")");
                adjustHueSlider();
                break;
            }
            case "rgb": {
                hue = this.rgbToHsl(...values)[0];
                rgb = values;
                newColorObj = this.getColorObj("rgb(" + rgb.join(",") + ")");
                adjustHueSlider();
                break;
            }
            case "sl": {
                hue = values[0];
                rgb = this.hslToRgb(...values);
                newColorObj = this.getColorObj("hsl(" + values.join(",") + ")");
                break;
            }
            case "hex": {
                rgb = this.hexToRgb("#" + values);
                hue = this.rgbToHsl(...values)[0];
                newColorObj = this.getColorObj("rgb(" + rgb.join(",") + ")");
                adjustHueSlider();
                break;
            }
            default: { return; }
        }

        this.setState({ ...this.state, color: newColorObj }, () => {
            this.drawColorPaletteCanvas();
            updatePaletteCursorPosition();
            resetTextInputs();
        });
    }



    setAlphaSliderTo(percentage) {
        const thumb = this.state.alphaSliderThumb;
        const width = this.state.alphaSlider.getBoundingClientRect().width;
        const left = width - Math.floor((percentage / 100) * width);

        thumb.style.left = left + "px";
        const color = this.getColorObj(`rgba(${this.state.color.rgb.r}, ${this.state.color.rgb.g}, ${this.state.color.rgb.b}, ${percentage / 100})`);
        this.setState({ ...this.state, color: color, input_a: undefined });
    }



    handleColorTextInputOnChange(e, inputName) {
        let value = inputName === "hex" ? e.target.value : Number(e.target.value);

        if (inputName === "r" || inputName === "g" || inputName === "b") {
            if (isNaN(value) || value < 0 || value > 255) value = 255; // user input error results max value
            const newState = Object.assign(this.state, {});
            let [r, g, b] = [this.state.color.rgb.r, this.state.color.rgb.g, this.state.color.rgb.b];

            switch (inputName) {
                case "r": { newState.input_r = value; r = value; break; }
                case "g": { newState.input_g = value; g = value; break; }
                case "b": { newState.input_b = value; b = value; break; }
                default: { }
            }

            this.setState(newState, () => { this.findAndSetColorByInput("rgb", [r, g, b]); });
        }

        if (inputName === "a") {
            if (isNaN(value) || value < 0 || value > 100) value = 100;

            this.setState({ ...this.state, input_a: value }, () => this.setAlphaSliderTo(this.state.input_a));
        }

        if (inputName === "h") {
            if (isNaN(value) || value < 0 || value > 359) value = 0; // 360deg = 0deg

            this.setState({ ...this.state, input_h: value },
                () => { this.findAndSetColorByInput("h", [value, this.state.color.hsl.s, this.state.color.hsl.l]); });
        }

        if (inputName === "s" || inputName === "l") {
            if (isNaN(value) || value < 0 || value > 100) value = 100;
            const newState = Object.assign(this.state, {});
            let [h, s, l] = [this.state.color.hsl.h, this.state.color.hsl.s, this.state.color.hsl.l];

            switch (inputName) {
                case "s": { newState.input_s = value; s = value; break; }
                case "l": { newState.input_l = value; l = value; break; }
                default: { }
            }

            this.setState(newState, () => { this.findAndSetColorByInput("sl", [h, s, l]); });
        }

        if (inputName === "hex") {
            if (value.length > 6) value = value.substr(0, 6); // trim if hex input is too long

            value = value.replace(/[^a-f0-9]/gi, ""); // don't let in valid values appear in text input
            const isCorrectHex = /^[a-f0-9]{6}$/gi.test(value);

            this.setState({ ...this.state, input_hex: value });

            if (isCorrectHex) this.findAndSetColorByInput("hex", value);
        }
    }



    /* The component displays if props visible is true. The reason behind not choosing conditional rendering is
     * for performance reasons (eg. on mousemove getting DOM elements is expensive therefore sliders were lagging)
     * heavily used DOM references are stored in the state. When component is closed it would loose the references to
     * certain ids. This case user experience takes priority over keeping the DOM unpolluted. */
    render() {
        return (
            <div
                id={this.props.id}
                className="ColorPicker"
                style={{
                    left: (this.state.x) + "px",
                    top: (this.state.y) + "px",
                    display: this.props.visible ? "block" : "none"
                }}
                onClick={e => e.stopPropagation()}
                //onBlur={() => this.props.close()}
                //ref={component => { if (ReactDOM.findDOMNode(component)) ReactDOM.findDOMNode(component).focus() }}
                onKeyDown={e => { if (e.keyCode === 27) this.props.close(); }}
                tabIndex={1}
            >
                <div className="ColorPicker__header">
                    <div className="ColorPicker__result-colors">
                        <div
                            id={(this.props.id || "") + "-prev-color"}
                            className="ColorPicker__prev-color"
                            style={{ backgroundImage: `url(${checkeredRect})` }}
                        >
                            <div style={{ backgroundColor: this.state.originalcolor.code.rgba }}></div>
                        </div>

                        <div
                            id={(this.props.id || "") + "-curr-color"}
                            className="ColorPicker__curr-color"
                            style={{ backgroundImage: `url(${checkeredRect})` }}
                        >
                            <div style={{ backgroundColor: this.state.color.code.rgba }}></div>
                        </div>
                    </div>
                    <button
                        className="close-btn ColorPicker--button-theme"
                        onClick={() => this.props.close(this.state)}
                        title="close [Esc]"
                    >&times;</button>
                </div>

                <div
                    className="ColorPicker__body"
                    onMouseMove={e => { this.handleColorPickerMouseMove(e); this.state.colorPaletteMouseDown && this.handleColorPaletteOnMouseMove(e); }}
                    onMouseUp={() => this.setState({ ...this.state, hueSliderMouseDown: false, alphaSliderMouseDown: false, sliderTouchPoint: 0, colorPaletteMouseDown: false })}
                    onMouseLeave={() => this.setState({ ...this.state, hueSliderMouseDown: false, alphaSliderMouseDown: false, sliderTouchPoint: 0, colorPaletteMouseDown: false })}
                >
                    <div className="ColorPicker__upper-box">
                        <div className="ColorPicker__palette" id={(this.props.id || "") + "-color-palette-box"}>
                            <canvas
                                id={(this.props.id || "") + "-color-palette"}
                                onMouseDown={e => { this.setState({ ...this.state, colorPaletteMouseDown: true }); }}
                                onClick={e => this.handleColorPaletteOnMouseMove(e)}
                            ></canvas>

                            <div
                                id={(this.props.id || "") + "-color-palette-cursor"}
                                className="ColorPicker__color-palette-cursor"
                                onMouseDown={() => this.setState({ ...this.state, colorPaletteMouseDown: true })}
                            >
                                <div><div></div></div> {/* inner white and black circles */}
                            </div>
                        </div>

                        <div className="ColorPicker__text-inputs">
                            <div title="red">R
                                    <input
                                    type="text"
                                    tabIndex={2}
                                    value={this.state.input_r !== undefined ? this.state.input_r : this.state.color.rgb.r}
                                    onFocus={() => this.setState({ ...this.state, input_r: this.state.color.rgb.r })}
                                    onChange={e => this.handleColorTextInputOnChange(e, "r")}
                                />
                            </div>

                            <div title="green">G
                                    <input
                                    type="text"
                                    tabIndex={3}
                                    value={this.state.input_g !== undefined ? this.state.input_g : this.state.color.rgb.g}
                                    onFocus={() => this.setState({ ...this.state, input_g: this.state.color.rgb.g })}
                                    onChange={e => this.handleColorTextInputOnChange(e, "g")}
                                />
                            </div>

                            <div title="blue">B
                                    <input
                                    type="text"
                                    tabIndex={4}
                                    value={this.state.input_b !== undefined ? this.state.input_b : this.state.color.rgb.b}
                                    onFocus={() => this.setState({ ...this.state, input_b: this.state.color.rgb.b })}
                                    onChange={e => this.handleColorTextInputOnChange(e, "b")}
                                />
                            </div>

                            <div title="transparency">A
                                    <input
                                    type="text"
                                    tabIndex={5}
                                    value={this.state.input_a !== undefined ? this.state.input_a : this.state.color.alpha}
                                    onFocus={() => this.setState({ ...this.state, input_a: this.state.color.alpha })}
                                    onChange={e => this.handleColorTextInputOnChange(e, "a")}

                                />
                            </div>

                            <div title="hue">H
                                    <input
                                    type="text"
                                    tabIndex={6}
                                    value={this.state.input_h !== undefined ? this.state.input_h : this.state.color.hsl.h}
                                    onFocus={() => this.setState({ ...this.state, input_h: this.state.color.hsl.h })}
                                    onChange={e => this.handleColorTextInputOnChange(e, "h")}
                                />
                            </div>

                            <div title="saturation">S
                                    <input
                                    type="text"
                                    tabIndex={7}
                                    value={this.state.input_s !== undefined ? this.state.input_s : this.state.color.hsl.s}
                                    onFocus={() => this.setState({ ...this.state, input_s: this.state.color.hsl.s })}
                                    onChange={e => this.handleColorTextInputOnChange(e, "s")}
                                />
                            </div>

                            <div title="lightness">L
                                    <input
                                    type="text"
                                    tabIndex={8}
                                    value={this.state.input_l !== undefined ? this.state.input_l : this.state.color.hsl.l}
                                    onFocus={() => this.setState({ ...this.state, input_l: this.state.color.hsl.l })}
                                    onChange={e => this.handleColorTextInputOnChange(e, "l")}
                                /></div>

                            <div title="hexadecimal value">#
                                    <input
                                    type="text"
                                    tabIndex={9}
                                    value={this.state.input_hex !== undefined ? this.state.input_hex : this.state.color.hex}
                                    onFocus={() => this.setState({ ...this.state, input_hex: this.state.color.hex })}
                                    onChange={e => this.handleColorTextInputOnChange(e, "hex")}
                                />
                            </div>

                            <p title={(this.state.color.websafe ? "websafe" : "notweb safe") + " color"}>
                                {!this.state.color.websafe ? <span style={{ color: "deeppink" }}>&#9888;</span> : <span style={{ color: "#2eff71" }}>&#9960;</span>}

                                <span title="css color string">{this.state.color.name ? this.state.color.name : <span>none</span>}</span>
                            </p>
                        </div>
                    </div>

                    <div className="ColorPicker__lower-box">
                        <div className="ColorPicker__hue-slider">
                            <div className="ColorPicker__slider-bg">
                                <div className="ColorPicker__hue"
                                    id={(this.props.id || "") + "-hue"}
                                    onMouseDown={e => this.handleSliderMouseDown(e)}>
                                    <canvas id={(this.props.id || "") + "-hue-color-points"}></canvas>

                                    <div
                                        id={(this.props.id || "") + "-hue__thumb"}
                                        className={`ColorPicker__slider-thumb ${this.state.hueSliderMouseDown ? "thumb-hover" : ""}`}
                                        style={{ backgroundImage: `url(${sliderThumb})` }}
                                        onMouseDown={e => this.handleSliderThumbMouseUpDown(e, true)}
                                        onMouseUp={e => this.handleSliderThumbMouseUpDown(e, false)}>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ColorPicker__alpha-box">
                            <div className="ColorPicker__alpha-slider">
                                <div className="ColorPicker__slider-bg">
                                    <div className="ColorPicker__alpha-bg" style={{ backgroundImage: `url(${transparentCheckerdBg})` }}>
                                        <div
                                            className="ColorPicker__alpha"
                                            id={(this.props.id || "") + "-alpha"}
                                            style={{ background: `${this.state.browser.prefix}linear-gradient(left, ${this.state.color.code.rgb}, transparent)` }}
                                            onMouseDown={e => this.handleSliderMouseDown(e)}>

                                            <div
                                                id={(this.props.id || "") + "-alpha__thumb"}
                                                className={`ColorPicker__slider-thumb ${this.state.alphaSliderMouseDown ? "thumb-hover" : ""}`}
                                                style={{ backgroundImage: `url(${sliderThumb})` }}
                                                onMouseDown={e => this.handleSliderThumbMouseUpDown(e, true)}
                                                onMouseUp={e => this.handleSliderThumbMouseUpDown(e, false)}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ColorPicker__ok-btn-box">
                            <button className="ColorPicker--button-theme">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}