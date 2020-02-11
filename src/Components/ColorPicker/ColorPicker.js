import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
            RGBA: this.props.RGBA || [255, 0, 0, 1], // default
            originalRGBA: this.props.RGBA || [255, 0, 0, 1],
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
            }
            hue *= 60;
            if (hue < 0) hue += 360;
        }
        return [hue, sat, lum]
    }



    drawColorPaletteCanvas() {
        const box = this.state.colorPaletteBox;
        const rect = box.getBoundingClientRect();
        const [width, height] = [rect.width, rect.height];
        const palette = this.state.colorPalette;
        const ctx = palette.getContext("2d");
        const [r, g, b, _] = [...this.state.RGBA];
        const hue = this.rgbToHsl(r, g, b)[0];

        palette.width = width;
        palette.height = height;

        const gradGreyScale = ctx.createLinearGradient(0, 0, 0, height);
        gradGreyScale.addColorStop(0, "white");
        gradGreyScale.addColorStop(0.01, "white"); // easier to pick up clear colors by the edges
        gradGreyScale.addColorStop(0.99, "black");
        gradGreyScale.addColorStop(1, "black");
        const gradHueOpacity = ctx.createLinearGradient(0, 0, width, 0);
        gradHueOpacity.addColorStop(0, `hsla(${Math.floor(hue)},100%,50%,0)`);
        gradHueOpacity.addColorStop(1, `hsla(${Math.floor(hue)},100%,50%,1)`);

        ctx.fillStyle = gradGreyScale;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = gradHueOpacity;
        ctx.globalCompositeOperation = "multiply";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
    }



    handleSliderMouseUpDown(e, mouseIsDown) {
        const sliderType = e.target.id.replace(/.*-hue__thumb/g, "hue").replace(/.*-alpha__thumb/g, "alpha");
        const touchPoint = e.clientX - document.getElementById(e.target.id).getBoundingClientRect().x;

        if (sliderType === "hue") this.setState({ ...this.state, hueSliderMouseDown: mouseIsDown, sliderTouchPoint: mouseIsDown ? touchPoint : 0 });
        if (sliderType === "alpha") this.setState({ ...this.state, alphaSliderMouseDown: mouseIsDown, sliderTouchPoint: mouseIsDown ? touchPoint : 0 });
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
        }, () => { this.drawHueCanvas(); });
    }



    handleColorPickerMouseMove(e) {
        if (!this.state.sliderThumbsMinOffset) this.primeDOMElements();

        const sliderType = this.state.hueSliderMouseDown ? "hue" : this.state.alphaSliderMouseDown ? "alpha" : "";

        if (sliderType) {
            const target = sliderType === "hue" ? this.state.hueSliderThumb : this.state.alphaSliderThumb;
            const maxX = this.state.alphaSlider.getBoundingClientRect().width; // hue & alpha has same width
            let diffX = e.clientX - this.state.sliderThumbsMinOffset - this.state.sliderTouchPoint;

            if (diffX < 0) diffX = 0;
            if (diffX > maxX - 1) diffX = maxX - 1;

            target.style.left = diffX + "px";
            if (sliderType === "hue") {
                const ctx = this.state.hueColorPoints.getContext("2d");
                const rgba = [...ctx.getImageData(diffX, 3, 1, 1).data];
                rgba[3] = this.state.RGBA[3];
                this.setState({ ...this.state, RGBA: rgba });

                this.drawColorPaletteCanvas();
            }
            else {
                const alpha = Number((1 - (Math.round((diffX / maxX) * 100) / 100)).toFixed(2));
                const rgba = [...this.state.RGBA];

                rgba[3] = alpha;
                this.setState({ ...this.state, RGBA: rgba });
            }
        }
    }



    handleColorPaletteOnMouseMove(e) {
        const target = this.state.colorPalette;
        const rect = target.getBoundingClientRect();
        const [width, height] = [rect.left, rect.top];
        const [x, y] = [e.clientX - width, e.clientY - height];
        const ctx = target.getContext("2d");
        const rgba = [...ctx.getImageData(x, y, 1, 1).data].map(n => Math.round(n));
        const [r, g, b, a] = [...rgba];

        this.setState({ ...this.state, RGBA: [r, g, b, this.state.RGBA[3]] });
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
                    ref={component => { if (ReactDOM.findDOMNode(component)) ReactDOM.findDOMNode(component).focus() }}
                >
                    <div className="ColorPicker__header">
                        <div className="ColorPicker__result-colors">
                            <div
                                id={(this.props.id || "") + "-prev-color"}
                                className="ColorPicker__prev-color"
                                style={{ backgroundImage: `url(${checkeredRect})` }}
                            >
                                <div style={{ backgroundColor: `rgba(${this.state.originalRGBA.join(",")}` }}></div>
                            </div>

                            <div
                                id={(this.props.id || "") + "-curr-color"}
                                className="ColorPicker__curr-color"
                                style={{ backgroundImage: `url(${checkeredRect})` }}
                            >
                                <div style={{ backgroundColor: `rgba(${this.state.RGBA.join(",")}` }}></div>
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
                        onMouseMove={e => this.handleColorPickerMouseMove(e)}
                        onMouseUp={() => this.setState({ ...this.state, hueSliderMouseDown: false, alphaSliderMouseDown: false, sliderTouchPoint: 0, colorPaletteMouseDown: false })}
                        onMouseLeave={() => this.setState({ ...this.state, hueSliderMouseDown: false, alphaSliderMouseDown: false, sliderTouchPoint: 0 })}
                    >
                        <div className="ColorPicker__upper-box">
                            <div className="ColorPicker__palette" id={(this.props.id || "") + "-color-palette-box"}>
                                <canvas
                                    id={(this.props.id || "") + "-color-palette"}
                                    onMouseDown={() => this.setState({ ...this.state, colorPaletteMouseDown: true })}
                                    onMouseLeave={() => this.setState({ ...this.state, colorPaletteMouseDown: false })}
                                    onMouseMove={e => this.state.colorPaletteMouseDown && this.handleColorPaletteOnMouseMove(e)}
                                ></canvas>
                            </div>

                            <div className="ColorPicker__text-inputs"></div>
                        </div>

                        <div className="ColorPicker__lower-box">
                            <div className="ColorPicker__hue-slider">
                                <div className="ColorPicker__slider-bg">
                                    <div className="ColorPicker__hue" id={(this.props.id || "") + "-hue"}>
                                        <canvas id={(this.props.id || "") + "-hue-color-points"}></canvas>

                                        <div
                                            id={(this.props.id || "") + "-hue__thumb"}
                                            className="ColorPicker__slider-thumb"
                                            style={{ backgroundImage: `url(${sliderThumb})` }}
                                            onMouseDown={e => this.handleSliderMouseUpDown(e, true)}
                                            onMouseUp={e => this.handleSliderMouseUpDown(e, false)}>
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
                                                style={{ background: `${this.state.browser.prefix}linear-gradient(left, rgba(${this.state.RGBA[0]}, ${this.state.RGBA[1]}, ${this.state.RGBA[2]}), transparent)` }}>
                                                <div
                                                    id={(this.props.id || "") + "-alpha__thumb"}
                                                    className="ColorPicker__slider-thumb"
                                                    style={{ backgroundImage: `url(${sliderThumb})` }}
                                                    onMouseDown={e => this.handleSliderMouseUpDown(e, true)}
                                                    onMouseUp={e => this.handleSliderMouseUpDown(e, false)}>
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