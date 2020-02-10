import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./ColorPicker.scss";
import transparentCheckerdBg from "./images/transparent_checkered_bg.png";
import sliderThumb from "./images/hue_slider_thumb.png";

export default class ColorPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hueSliderMouseDown: false,
            alphaSliderMouseDown: false,
            sliderThumbsMinOffset: undefined,
            alphaSliderThumb: document.getElementById((this.props.id || "") + "-alpha__thumb"),
            hueSliderThumb: document.getElementById((this.props.id || "") + "-hue__thumb"),
        };
    }



    handleSliderMouseUpDown(e, mouseIsDown) {
        const sliderType = e.target.id.replace(/.*-hue__thumb/g, "hue").replace(/.*-alpha__thumb/g, "alpha");
        const touchPoint = e.clientX - document.getElementById(e.target.id).getBoundingClientRect().x;

        if (sliderType === "hue") this.setState({ ...this.state, hueSliderMouseDown: mouseIsDown, sliderTouchPoint: mouseIsDown ? touchPoint : 0 });
        if (sliderType === "alpha") this.setState({ ...this.state, alphaSliderMouseDown: mouseIsDown, sliderTouchPoint: mouseIsDown ? touchPoint : 0 });
    }



    handleColorPickerMouseMove(e) {
        // when react componentDidMount is called non of these elems are in the DOM 
        // set state when component is mounted and rendered, first mousemove seems to be a smooth way to prime state without slowing performance 
        if (!this.state.sliderThumbsMinOffset) this.setState({
            ...this.state,
            alphaSlider: document.getElementById((this.props.id || "") + "-alpha"),
            hueSlider: document.getElementById((this.props.id || "") + "-hue"),
            alphaSliderThumb: document.getElementById((this.props.id || "") + "-alpha__thumb"),
            hueSliderThumb: document.getElementById((this.props.id || "") + "-hue__thumb"),
            sliderThumbsMinOffset: document.getElementById((this.props.id || "") + "-hue__thumb").getBoundingClientRect().left,
        });

        const sliderType = this.state.hueSliderMouseDown ? "hue" : this.state.alphaSliderMouseDown ? "alpha" : "";

        if (sliderType) {
            const target = sliderType === "hue" ? this.state.hueSliderThumb : this.state.alphaSliderThumb;
            const maxX = this.state.alphaSlider.getBoundingClientRect().width; // hue & alpha has same width
            let diffX = e.clientX - this.state.sliderThumbsMinOffset - this.state.sliderTouchPoint;

            if (diffX < 0) diffX = 0;
            if (diffX > maxX - 1) diffX = maxX - 1;

            target.style.left = diffX + "px";
        }
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
                        <button
                            className="close-btn ColorPicker--button-theme"
                            onClick={() => this.props.close()}
                            title="close [Esc]"
                        >&times;</button>
                    </div>

                    <div
                        className="ColorPicker__body"
                        onMouseMove={e => this.handleColorPickerMouseMove(e)}
                        onMouseUp={() => this.setState({ ...this.state, hueSliderMouseDown: false, alphaSliderMouseDown: false, sliderTouchPoint: 0 })}
                        onMouseLeave={() => this.setState({ ...this.state, hueSliderMouseDown: false, alphaSliderMouseDown: false, sliderTouchPoint: 0 })}
                    >
                        <div className="ColorPicker__upper-box">
                            <div className="ColorPicker__palette"></div>

                            <div className="ColorPicker__text-inputs"></div>
                        </div>

                        <div className="ColorPicker__lower-box">
                            <div className="ColorPicker__hue-slider">
                                <div className="ColorPicker__slider-bg">
                                    <div className="ColorPicker__hue" id={(this.props.id || "") + "-hue"}>
                                        <div
                                            id={(this.props.id || "") + "-hue__thumb"}
                                            className="ColorPicker__slider-thumb"
                                            style={{ backgroundImage: `url(${sliderThumb})` }}
                                            onMouseDown={e => this.handleSliderMouseUpDown(e, true)}
                                            onMouseUp={e => this.handleSliderMouseUpDown(e, false)}>
                                            <div className="ColorPicker__slider-point" id="hue-slider-point"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ColorPicker__alpha-box">
                                <div className="ColorPicker__alpha-slider">
                                    <div className="ColorPicker__slider-bg">
                                        <div className="ColorPicker__alpha-bg" style={{ backgroundImage: `url(${transparentCheckerdBg})` }}>
                                            <div className="ColorPicker__alpha" id={(this.props.id || "") + "-alpha"} >
                                                <div
                                                    id={(this.props.id || "") + "-alpha__thumb"}
                                                    className="ColorPicker__slider-thumb"
                                                    style={{ backgroundImage: `url(${sliderThumb})` }}
                                                    onMouseDown={e => this.handleSliderMouseUpDown(e, true)}
                                                    onMouseUp={e => this.handleSliderMouseUpDown(e, false)}>
                                                    <div className="ColorPicker__slider-point" id="alpha-slider-point"></div>
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