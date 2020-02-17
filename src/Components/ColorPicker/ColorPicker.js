import React, { Component } from 'react';
import "./ColorPicker.scss";
import transparentCheckerdBg from "./images/transparent_checkered_bg.png";
import checkeredRect from "./images/checkered_rect.png";
import sliderThumb from "./images/hue_slider_thumb.png";



export default class ColorPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            browser: { // gradients won't work without sniffing the browser
                agent: navigator.userAgent.match(/(Chrome|Firefox|MSIE|Egde|Safari|Opera)/g)[0],
                prefix: `-${(Array.prototype.slice.call(window.getComputedStyle(document.documentElement, '')).join('').match(/-(moz|webkit|ms)-/))[1]}-`
            },
            color: this.getColorObj(this.props.color || "rgb(255, 0, 0)"),
            originalcolor: this.getColorObj(this.props.color || "rgb(255, 0, 0)"),
            hueSliderMouseDown: false,
            alphaSliderMouseDown: false,
            colorPaletteMouseDown: false,
            sliderThumbsMinOffset: undefined,
            alphaSliderThumb: document.getElementById((this.props.id || "") + "-alpha__thumb"),
            hueSliderThumb: document.getElementById((this.props.id || "") + "-hue__thumb"),
            hueCanvasColorSequenceDrawn: false, // the hue thats color will picked need to be drawn when component is visible (first mouseover event)
            colorPaletteDrawn: false, // same goes for color palette (as soon as component is visible)
        };
    }


    componentDidUpdate() {
        if (!this.state.colorPaletteDrawn && document.getElementById((this.props.id || "") + "-color-palette")) {
            this.setState({
                ...this.state,
                colorPaletteDrawn: true,
                colorPaletteBox: document.getElementById((this.props.id || "") + "-color-palette-box"),
                colorPalette: document.getElementById((this.props.id || "") + "-color-palette"),
            },
                () => this.drawColorPaletteCanvas());
        }
    }



    // when react componentDidMount is called non of the elems are in the DOM
    // getting elements multiple times in mouse events comes at the expense of performance
    // set state when component is mounted and rendered, first mousemove seems to be a smooth way to prime state without slowing performance 
    primeDOMElements() {
        this.setState({
            ...this.state,
            alphaSlider: document.getElementById((this.props.id || "") + "-alpha"),
            hueSlider: document.getElementById((this.props.id || "") + "-hue"),
            alphaSliderThumb: document.getElementById((this.props.id || "") + "-alpha__thumb"),
            hueSliderThumb: document.getElementById((this.props.id || "") + "-hue__thumb"),
            sliderThumbsMinOffset: document.getElementById((this.props.id || "") + "-hue__thumb").getBoundingClientRect().left,
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



    handleSliderThumbMouseUpDown(e, mouseIsDown) {
        const sliderType = e.target.id.replace(/.*-hue__thumb/g, "hue").replace(/.*-alpha__thumb/g, "alpha");
        const touchPoint = e.clientX - document.getElementById(e.target.id).getBoundingClientRect().x;

        if (sliderType === "hue") this.setState({ ...this.state, hueSliderMouseDown: mouseIsDown, sliderTouchPoint: mouseIsDown ? touchPoint : 0, sliderEventFrom: "thumb" });
        if (sliderType === "alpha") this.setState({ ...this.state, alphaSliderMouseDown: mouseIsDown, sliderTouchPoint: mouseIsDown ? touchPoint : 0, sliderEventFrom: "thumb" });
    }



    handleSliderMouseDown(e) {
        e.persist(); // because synt. event is reused in async setState, it would be nullified by React, thus e.target is not available in callback

        const sliderType = e.target.id.replace(/.*-hue-color-points/g, "hue").replace(/.*-alpha/g, "alpha");
        const touchPoint = e.clientX - document.getElementById(e.target.id).getBoundingClientRect().x;

        if (sliderType === "hue") this.setState({ ...this.state, hueSliderMouseDown: true, sliderTouchPoint: touchPoint, sliderEventFrom: "slider" }
            , () => this.handleColorPickerMouseMove(e));
        if (sliderType === "alpha") this.setState({ ...this.state, alphaSliderMouseDown: true, sliderTouchPoint: touchPoint, sliderEventFrom: "slider" }
            , () => this.handleColorPickerMouseMove(e));
    }



    handleColorPickerMouseMove(e) {
        if (!this.state.sliderThumbsMinOffset) this.primeDOMElements();

        const sliderType = this.state.hueSliderMouseDown ? "hue" : this.state.alphaSliderMouseDown ? "alpha" : "";

        if (sliderType) {
            // set the new position of slider thumb
            const maxX = this.state.alphaSlider.getBoundingClientRect().width; // hue & alpha has same width
            const target = sliderType === "hue" ? this.state.hueSliderThumb : this.state.alphaSliderThumb;
            let diffX = 0;

            if (this.state.sliderEventFrom === "thumb") diffX = e.clientX - this.state.sliderThumbsMinOffset - this.state.sliderTouchPoint;
            if (this.state.sliderEventFrom === "slider") diffX = e.clientX - this.state.sliderThumbsMinOffset - 11;

            if (diffX < 0) diffX = 0;
            if (diffX > maxX - 1) diffX = maxX - 1;

            target.style.left = diffX + "px";

            // react on hue or alpha changes
            if (sliderType === "hue") {
                const ctx = this.state.hueColorPoints.getContext("2d");
                const [r, g, b] = [...ctx.getImageData(diffX, 3, 1, 1).data];

                this.setState({ ...this.state, color: this.getColorObj(`rgba(${r}, ${g}, ${b}, ${this.state.color.alpha})`) }, () => {
                    this.drawColorPaletteCanvas()
                    const [r, g, b] = [...this.getColorUnderPaletteCursor()];
                    this.setState({ ...this.state, color: this.getColorObj(`rgba(${r}, ${g}, ${b}, ${this.state.color.alpha})`) });
                });
            }
            else {
                const alpha = Number((1 - (Math.round((diffX / maxX) * 100) / 100)).toFixed(2));
                const colorObj = this.getColorObj(`rgba(${this.state.color.rgb.r}, ${this.state.color.rgb.g}, ${this.state.color.rgb.b}, ${alpha})`);
                this.setState({ ...this.state, color: colorObj });
            }
        }
    }



    // function can be invoked from mousemove on palette or from hue slider
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
        // find out mouse cursor position and add correction 
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

        // set state
        const [r, g, b] = [...this.getColorUnderPaletteCursor(x, y)];
        this.setState({ ...this.state, color: this.getColorObj(`rgba(${r}, ${g}, ${b}, ${this.state.color.alpha})`) });
    }



    handleInputOnchange(e) {
        console.log(this.getColorObj("hsla(180, 100, 50, 0.3)"));
    }



    // input can be any color or color code or text eg: red, #ff0000ff, rgba(255, 0, 0, 0.5)
    getColorObj(colorStr) {
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

        let r, g, b, hex, h, s, l, a, name, safe = undefined;
        const colorType = ["rgb", "rgba", "hex", "hsl", "hsla", "invalid"][[isRgb(colorStr), isRgba(colorStr), isHex(colorStr), isHsl(colorStr), isHsla(colorStr), true].findIndex(e => !!e)];

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
            default: { console.log("Invalid color : ", colorStr); }
        }

        if (colorType !== "invalid") {
            a = (a === undefined) ? 1 : a; // a can be 0 which is falsy
            safe = isWebSafe(hex);
            name = (require("./json/colors.json").find(c => hex === c.hex.toLowerCase()) || { name: "" }).name.toLowerCase();
        }

        return ({
            valid: colorType !== "invalid",
            websafe: safe,
            rgb: { r: r, g: g, b: b },
            hex: hex,
            hsl: { h: h, s: s, l: l },
            colorName: name,
            alpha: a,
            code: {
                rgb: `rgb(${r}, ${g}, ${b})`,
                rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
                hex: `#${hex}`,
                hsl: `hsl(${h}, ${s}%, ${l}%)`,
                hsla: `hsla(${h}, ${s}%, ${l}%, ${a})`,
                name: name
            }
        })
    }


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



    render() {
        return (
            this.props.visible ? (
                <div
                    className="ColorPicker"
                    style={{ left: (this.props.X || 0) + "px", top: (this.props.Y || 0) + "px" }}
                    onClick={e => e.stopPropagation()}
                    //onBlur={() => this.props.close()}
                    onKeyDown={e => { if (e.keyCode === 27) this.props.close(); }}
                    tabIndex={1}
                //ref={component => { if (ReactDOM.findDOMNode(component)) ReactDOM.findDOMNode(component).focus() }}
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
                            onClick={() => this.props.close()}
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
                                <div>R <input type="text" tabIndex={2} value={this.state.color.rgb.r} onChange={e => this.handleInputOnchange(e)} /></div>

                                <div>G <input type="text" tabIndex={3} value={this.state.color.rgb.g} /></div>

                                <div>B <input type="text" tabIndex={4} value={this.state.color.rgb.b} /></div>

                                <div>A <input type="text" tabIndex={5} value={this.state.color.alpha} /></div>

                                <div>H <input type="text" tabIndex={6} value={this.state.color.hsl.h} /></div>

                                <div>S <input type="text" tabIndex={7} value={this.state.color.hsl.s} /></div>

                                <div>L <input type="text" tabIndex={8} value={this.state.color.hsl.l} /></div>

                                <div># <input type="text" tabIndex={9} value={this.state.color.hex} /></div>

                                <div>! <input type="text" tabIndex={9} value={this.state.color.colorName} /></div>
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
                </div>)
                : null
        );
    }
}